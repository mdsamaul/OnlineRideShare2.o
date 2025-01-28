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
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-instend-customer',
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
  templateUrl: './instend-customer.component.html',
  styleUrl: './instend-customer.component.css',
})
export class InstendCustomerComponent implements OnInit, OnDestroy {
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
      customerImage: [''], 
      customerLatitude: [0],
      customerLongitude: [0],
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

  private submitForm() {
    // For Edit
    this.authService.editCustomer(1026, this.customerForm.value).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        this.router.navigateByUrl('/set/location');
      },
      error: (err) => {
        this.toastrService.error(err.message);
      },
    });
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.toastrService.error(
        'Please fill in all required fields correctly.'
      );
      return;
    }

    if (this.selectedFile) {
      // Image upload first
      this.authService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          const imageUrl = response.data.url;
          this.customerForm.patchValue({
            customerImage: imageUrl,
          });

          // Now edit customer
          this.submitForm();
        },
        error: (err) => {
          this.toastrService.error('Image upload failed.');
          console.error(err);
        },
      });
    } else {
      // No image selected, directly proceed
      this.submitForm();
    }
  }

  ngOnInit(): void {
    this.authService.detaislCustomer().subscribe({
      next: (res) => {
        console.log(res[0].customerImage);
        this.existingImageUrl = res[0].customerImage;
      },
    });

    this.authService.detaislCustomer().subscribe({
      next: (response) => {
        console.log(response);
        this.customerDetails$ = response;
      },
      error: (err) => {
        this.toastrService.error(err.message);
      },
    });

    this.paramsFormSubscription = this.activatedRouter.params.subscribe({
      next: (response) => {
        this.id = response['id'];
        if (!this.id) return;

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
  }
}