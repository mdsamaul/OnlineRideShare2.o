import { CommonModule } from '@angular/common';
import { Component, CreateComputedOptions, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ActivatedRoute,
  Route,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { CompanyCreateRequest } from '../../interfaces/company-create-request';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.css',
})
export class DriverFormComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  isEdit = false;
  driverId: number = 0;
  form!: FormGroup;
  driverFormSubscription!: Subscription;
  paramsSubscription!: Subscription;
  companys$! : Observable<CompanyCreateRequest[]>;
  selectCompany:string=';'
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    if (this.driverFormSubscription) {
      this.driverFormSubscription.unsubscribe();
    }
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
  onSubmit(): void {
    if (!this.isEdit) {
      if (this.form.invalid) {
        this.toastrService.warning(
          'please fill in all required fields correctly.'
        );
        return;
      }
      const formData = this.form.value;
      console.log("formData ",formData);
      this.driverFormSubscription = this.authService
        .createDriver(formData)
        .subscribe({
          next: (response) => {
            this.toastrService.success(response.message);
            console.log(response);
    
            this.router.navigateByUrl('/driver');
          },
          error: (err) => {
            this.toastrService.error(err.message);
            console.log(err);
          },
        });
    } else {
      if (this.form.invalid) {
        this.toastrService.error(
          'please fill in all required fields correctly'
        );
        return;
      }
      this.authService.driverEdit(this.driverId, this.form.value).subscribe({
        next: (value) => {
          console.log('driver edit : ', Response);
          this.router.navigateByUrl('/driver');
          this.toastrService.success('Edit successfully');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error.message);
        },
      });
    }
  }
  
  ngOnInit(): void {
        
    console.log("select company form driver form ",this.selectCompany);
    

    this.paramsSubscription = this.activatedRouter.params.subscribe({
      next: (response) => {
        console.log("edit driver",response['id']);
        this.driverId = response['id'];
        if (!this.driverId) return;
        this.authService.getDriverById(this.driverId).subscribe({
          next: (response) => {
            console.log('get by id driver ', response);
            this.form.patchValue(response);
            this.isEdit = true;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.form = this.fb.group({
      driverName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      drivingLicenseNo: ['', Validators.required],
      driverNid: ['', Validators.required],
      driverImage: [''],
      companyId: [null],
      company: [null],
      driverLatitude: [null],
      driverLongitude: [null], 
      isAvailable: [true], 
    });
    this.getCompant()
    
  }

  private getCompant():void{
    this.companys$= this.authService.getCompany();
  }

}
