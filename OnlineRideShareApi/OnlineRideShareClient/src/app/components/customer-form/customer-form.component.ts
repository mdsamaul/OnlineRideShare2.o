import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule, 
    MatButtonModule,    
    HttpClientModule
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
  id: number = 0;

selectedFile: File | null = null;
imagePreview: string | ArrayBuffer | null = null;
existingImageUrl: any | null = null;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhoneNumber: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerNID: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    if (this.customerFormSubscription) {
      this.customerFormSubscription.unsubscribe();
    }
    if (this.paramsFormSubscription) {
      this.paramsFormSubscription.unsubscribe();
    }
  }



onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    // Generate image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

clearFile(): void {
  this.selectedFile = null;
  this.imagePreview = null;
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Reset the file input
  }
}



  onUpload(): void {
    if (this.selectedFile) {
      this.authService.uploadImage(this.selectedFile).subscribe(
        (response) => {
          console.log('Upload successful:', response.data.url);
  
          this.customerForm.patchValue({
            customerImage: response.data.url,
          });
  
          this.authService.editCustomer(this.id, this.customerForm.value).subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.router.navigateByUrl('/set/location');
            },
            error: (err) => {
              this.toastrService.error(err.message);
            },
          });
        },
        (error) => {
          console.error('Upload failed:', error);
          this.toastrService.error('Image upload failed.');
        }
      );
    } else {
      console.error('No image selected');
      this.toastrService.warning('Please select an image before uploading.');
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
            this.onUpload();          
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
      this.authService
        .editCustomer(this.id, this.customerForm.value)
        .subscribe({
          next: (response) => {
            this.onUpload();
          },
          error: (err) => {
            this.toastrService.error(err.message);
          },
        });
    }
  }
  ngOnInit(): void {
    this.authService.detaislCustomer().subscribe({
      next: (res) => {
        console.log(res[0].customerImage);
        this.existingImageUrl=res[0].customerImage;
      },
    });
    this.authService.detaislCustomer().subscribe({
      next: (response) => {
        console.log(response);
        // this.existingImageUrl=response
        this.customerDetails$ = response;
      },
      error: (err) => {
        this.toastrService.error(err.message);
      },
    });
    // console.log(this.authService.sendLocationToApi());
    this.paramsFormSubscription = this.activatedRouter.params.subscribe({
      next: (response) => {
        // console.log("res pon : ",response);
        this.id = response['id'];
        if (!this.id) return;
        // console.log("data : ",this.authService.getIdByCustomer(this.id));
        this.authService.getIdByCustomer(this.id).subscribe({
          next: (res) => {
            console.log(res);
            this.customerForm.patchValue(res);
            this.isEdit = true;
          },
          error: (err) => {
            this.toastrService.error(err.message);
          },
        });
      },
      error: (err) => {
        this.toastrService.error(err.message);
      },
    });
   
      this.customerForm = this.fb.group({
        customerName: ['', [Validators.required]],
        customerPhoneNumber: ['', [Validators.required]],
        customerEmail: ['', [Validators.required]],
        customerNID: ['', [Validators.required]],
        customerImage: '', 
        customerLatitude: [0],
        customerLongitude: [0],
      });

  }
}

