import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { response } from 'express';
import { VehicleType } from '../../interfaces/vehicle-type';

@Component({
  selector: 'app-vehicle-type-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterLink,
    MatIconModule,
    RouterModule,
    MatSelectModule,
  ],
  templateUrl: './vehicle-type-form.component.html',
  styleUrl: './vehicle-type-form.component.css',
})
export class VehicleTypeFormComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  form!: FormGroup;
  isVTEdit = false;
  vehicleTypeId: number = 0;
  vehicleFormSubscription!: Subscription;
  paramSubsctiption!: Subscription;



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRouter: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    if (this.vehicleFormSubscription) {
      this.vehicleFormSubscription.unsubscribe();
    }
    if (this.paramSubsctiption) {
      this.paramSubsctiption.unsubscribe();
    }
   
  }
  

  onSubmit(): void {
   
   
    // debugger
    if (!this.isVTEdit) {
      if (this.form.invalid) {
        this.toastrService.error('Please fill in all required fields correcly');
        return;
      }
      // debugger
    const fromVtData = this.form.value;
    console.log(fromVtData);
    this.vehicleFormSubscription = this.authService
      .postVehicleType(fromVtData)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.toastrService.success(response.message);
          this.router.navigateByUrl('/vehicle');
        },
      });
    }else{
      if(this.form.invalid){
        this.toastrService.error(
          'please fill in all required fields correctly'
        );
        return;
      }
      this.authService.editVehicleType(this.vehicleTypeId, this.form.value).subscribe({
        next:(response)=>{
          this.toastrService.success(response.message);
          this.router.navigateByUrl('/vehicle');
        }, 
        error:(err)=>{
          this.toastrService.error(err.error.message);
        }
      })
    }    
  }

  ngOnInit(): void {

    
    this.paramSubsctiption= this.activatedRouter.params.subscribe({
      next:(response)=>{
        this.vehicleTypeId=response['id'];
        console.log(this.vehicleTypeId);
        if(!this.vehicleTypeId) return;
        this.authService.getVehicleTypeById(this.vehicleTypeId).subscribe({
          next:(response)=>{
            // this.toastrService.success(response.message);
            this.form.patchValue(response);
            this.isVTEdit=true;            
          },
          error:(err)=>{
            this.toastrService.error(err.error.message);
          },
        });
      },
      error:(err)=>{
        this.toastrService.error(err.error.message);
      }
    })
    this.form = this.fb.group({
      vehicleTypeName: ['', Validators.required],
      perKmFare: ['', Validators.required],
    });
  }
}
