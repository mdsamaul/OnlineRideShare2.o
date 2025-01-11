import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  customerForm!: FormGroup;
  customerFormSubscription!: Subscription;
  paramsFormSubscription!: Subscription;
  isEdit = false;
  customerDetails$: any[] = [];
  id: number=0;
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    if (this.customerFormSubscription) {
      this.customerFormSubscription.unsubscribe();
    }
    if (this.paramsFormSubscription) {
      this.paramsFormSubscription.unsubscribe();
    }
   
  }
  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         this.authService.sendLocationToApi(latitude, longitude).subscribe({
  //           next: (res) => {
  //             // console.log(res);
  //           },
  //           error: (err) => {
  //             // console.log(err.message);
  //             this.toastrService.error(err.message);
  //           },
  //         });
  //       },
  //       (error) => {
  //         this.toastrService.error(error.message);
  //       }
  //     );
  //   } else {
  //     this.toastrService.warning(
  //       'Geolocation is not supported by this browser.'
  //     );
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      console.log('Selected file:', file);
    }
  }

  onSubmit() {
    if (!this.isEdit) {
      if (this.customerForm.invalid) {
        this.toastrService.error(
          'Please fill in all required fields correctly.'
        );
        return;
      }
      this.customerFormSubscription = this.authService
        .createCustomer(this.customerForm.value)
        .subscribe({
          next: (response) => {
            this.toastrService.success(response.message);
            console.log(response);
            this.router.navigateByUrl('/set/location');
          },
          error: (e) => {
            this.toastrService.error(e.message);
          },
        });
    } else {
      if (this.customerForm.invalid) {
        this.toastrService.warning(
          'Please fill in all required fields correctly.'
        );
        return;
      }
      this.authService.editCustomer(this.id, this.customerForm.value).subscribe({
        next:(response)=>{
          this.toastrService.success(response.message);
          this.router.navigateByUrl('/set/location');
        },
        error:(err)=>{
          this.toastrService.error(err.message);
        }
      })
    }
  }
  ngOnInit(): void {
    this.authService.detaislCustomer().subscribe({
      next:(res)=>{
        console.log(res.length);
      }
    });
    this.authService.detaislCustomer().subscribe({
      next:(response)=>{
        this.customerDetails$= response;
      },error:(err)=>{
        this.toastrService.error(err.message);
      }
    })
    // console.log(this.authService.sendLocationToApi());
this.paramsFormSubscription= this.activatedRouter.params.subscribe({
  next:(response)=>{
    // console.log("res pon : ",response);
    this.id=response['id'];
    if(!this.id) return;
    // console.log("data : ",this.authService.getIdByCustomer(this.id));
    this.authService.getIdByCustomer(this.id).subscribe({
      next:(res)=>{    
        console.log(res);    
        this.customerForm.patchValue(res);
        this.isEdit=true;
      },
      error:(err)=>{
        this.toastrService.error(err.message);
      }
    });
  }, error:(err)=>{
    this.toastrService.error(err.message);
  }
})
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required]],
      customerPhoneNumber: ['', [Validators.required]],
      customerEmail: ['', [Validators.required]],
      customerNID: ['', [Validators.required]],
      customerImage: [''],
      customerLatitude: [0],
      customerLongitude: [0],
    });
  }
}
