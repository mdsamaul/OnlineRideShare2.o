import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../../interfaces/customer-response';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-request-driver-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    HttpClientModule,
    MatInputModule,
  ],
  templateUrl: './request-driver-details.component.html',
  styleUrls: ['./request-driver-details.component.css'],
})
export class RequestDriverDetailsComponent implements OnInit {
  requestId!: number; // Declare requestId to hold the value from the URL
  driverDetails$!: DriverCreateRequest; // Correct type for Observable
  isMyselfModalOpen: boolean = false;
  isReferModalOpen: boolean = false;
  isContactModalOpen: boolean = false;
  customer$!: Customer;
  isLoading = false;
  isModalOpen = false;
  customerForm!: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  existingImageUrl: any | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedrouter: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.customerForm = this.fb.group({
      customerId: 0,
      customerName: ['', Validators.required],
      customerPhoneNumber: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerNID: ['', [Validators.required]],
      customerImage: [''],
      customerLatitude: [0],
      customerLongitude: [0],
    });
  }

  ngOnInit(): void {
    this.activatedrouter.params.subscribe({
      next: (res) => {
        this.requestId = res['requestId'];
        console.log('Request ID:', this.requestId); // Log requestId

        this.reDriverDetails();
        this.CheckCustomerConfirm(this.requestId);
      },
      error: (err) => {
        console.error('Error fetching route params:', err);
      },
    });
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
    const fileInput = document.getElementById(
      'file-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input
    }
  }

  // private submitForm(id: number) {
  //   // For Edit
  //   this.authService.editCustomer(id, this.customerForm.value).subscribe({
  //     next: (response) => {
  //       this.toastrService.success(response.message);
  //       // this.router.navigateByUrl('/set/location');
  //       // this.isModalOpen=false;
  //     },
  //     error: (err) => {
  //       this.toastrService.error(err.message);
  //     },
  //   });
  // }

  // onCustomerSubmit() {
  //   if (this.customerForm.invalid) {
  //     this.toastrService.error(
  //       'Please fill in all required fields correctly.'
  //     );
  //     return;
  //   }

  //   if (this.selectedFile) {
  //     // Image upload first
  //     this.authService.uploadImage(this.selectedFile).subscribe({
  //       next: (response) => {
  //         const imageUrl = response.data.url;
  //         this.customerForm.patchValue({
  //           customerImage: imageUrl,
  //         });

  //         // Now edit customer
  //         this.submitForm();
  //       },
  //       error: (err) => {
  //         this.toastrService.error('Image upload failed.');
  //         console.error(err);
  //       },
  //     });
  //   } else {
  //     // No image selected, directly proceed
  //     this.submitForm();
  //   }
  // }

  contactDriver(): void {
    // Logic for contacting the driver
    console.log('Contacting driver...');
  }

  private reDriverDetails(): void {
    // Fetching driver details using the requestId
    this.authService.getDriverContact(this.requestId).subscribe({
      next: (res) => {
        this.driverDetails$ = res; // Wrap the res into an Observable
        console.log('Driver Details:', res);
      },
      error: (err) => {
        console.error('Error fetching driver details:', err);
      },
    });
  }

  openContactModal(): void {
    this.isMyselfModalOpen = true; // Open modal
  }

  closeContactModal(): void {
    this.isMyselfModalOpen = false; // Close modal
  }

  bookRideForSelf(): void {
    console.log(this.requestId);
    this.authService.getRequest(this.requestId).subscribe((res) => {
      this.authService
        .getIdByCustomer(res.customerId!)
        .subscribe((resCustomer) => {
          if (resCustomer.customerPhoneNumber == 'N/A') {
            console.log(resCustomer);
            // this.submitForm(res.customerId!);
            this.isModalOpen = true;
            this.customerForm.patchValue({
              customerId: resCustomer.customerId,
              customerName: resCustomer.customerName || '',
              customerPhoneNumber: resCustomer.customerPhoneNumber || '',
              customerEmail: resCustomer.customerEmail || '',
              customerNID: resCustomer.customerNID || '',
            });

            // ইমেজের প্রিভিউ সেট করুন
            if (resCustomer.customerImage) {
              this.imagePreview = resCustomer.customerImage;
            }
          } else {
            this.isModalOpen = false;
            this.isLoading = true;
            this.authService
              .customerConfirmRequest(this.requestId, this.requestId)
              .subscribe((res) => {
                console.log(res);
                this.isLoading = false;
                this.isContactModalOpen = true;
                this.isMyselfModalOpen = false;
                this.isReferModalOpen = false;
              });
          }
        });
    });
    console.log('Ride booked for yourself.');
    // // this.closeContactModal(); // Modal বন্ধ করার জন্য
    // // console.log(this.authService.getUserDetail());
  }
  onCustomerSubmit(): void {
    this.isLoading=true;
    // debugger;
    if (this.customerForm.valid) {
      const updatedCustomerData = this.customerForm.value;
      if (this.selectedFile) {
        // Image upload first
        this.authService.uploadImage(this.selectedFile).subscribe({
          next: (response) => {
            const imageUrl = response.data.url;
            this.customerForm.patchValue({
              customerImage: imageUrl,
            });
    
            // Now create or edit customer
            this.authService.editCustomer(updatedCustomerData.customerId, this.customerForm.value).subscribe((res) => {
              console.log('Customer data updated successfully!', res);
              // this.router.navigateByUrl('/set/location');
            
              this.getCurrentLocation();
            });
          },
          error: (err) => {
            this.toastrService.error('Image upload failed.');
            console.error(err);
            this.isLoading=false;
          },
        });
      } else {
        // No image selected, directly proceed
        this.authService.editCustomer(updatedCustomerData.customerId, this.customerForm.value).subscribe((res) => {
          console.log('Customer data updated successfully!', res);
          // this.router.navigateByUrl('/set/location');
          this.getCurrentLocation();
         this.isLoading=false;
        });
      }    
    }
  }


  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.authService.sendLocationToApi(latitude, longitude).subscribe({
            next: (res) => {
              // console.log(res);
              this.toastrService.success(res.message);
              // this.route.navigateByUrl('/customer');
              this.isModalOpen=false;
              this.isLoading=false;
            },
            error: (err) => {
              // console.log(err.message);
              this.toastrService.error(err.message);
            },
          });
        },
        (error) => {
          this.toastrService.error(error.message);
        }
      );
    } else {
      this.toastrService.warning(
        'Geolocation is not supported by this browser.'
      );
      console.log('Geolocation is not supported by this browser.');
    }
  }
  

  closeReferRideDialog(): void {
    this.isReferModalOpen = false;
  }
  referRideToSomeone(): void {
    console.log('Ride referred to someone.');
    this.isReferModalOpen = true;
    this.isMyselfModalOpen = false;
    this.isContactModalOpen = false;
  }
  user = {
    Name: '',
    Phone: '',
  };
  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Data:', this.user);
      this.isLoading = true;
      this.authService.referCustomer(this.requestId, this.user).subscribe({
        next: (res) => {
          console.log(res);
          this.isReferModalOpen = false;
          this.isMyselfModalOpen = false;
          this.isContactModalOpen = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  private CheckCustomerConfirm(requestId: number): void {
    console.log('Starting CheckCustomerConfirm for Request ID:', requestId);
    if (!requestId || isNaN(requestId)) {
      console.error('Invalid Request ID:', requestId);
      return;
    }

    const interval = setInterval(() => {
      console.log('Checking request status for ID:', requestId); // Log interval execution
      this.authService.getRequest(requestId).subscribe({
        next: (res) => {
          console.log('API Response:', res); // Log API response
          if (res.requestStatus === 'Pickup Confirmed') {
            clearInterval(interval);
            console.log('Pickup Confirmed:', res);
            this.router.navigateByUrl('/');
          }
        },
        error: (err) => {
          console.error('Error checking request status:', err);
          clearInterval(interval);
        },
      });
    }, 3000);
  }

  openDialog(): void {
    this.isModalOpen = true;
  }
  closeDialog(): void {
    this.isModalOpen = false;
  }
}
