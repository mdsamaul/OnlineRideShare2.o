import {
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VehicleDetails } from '../../interfaces/vehicle-details';
import { VehicleType } from '../../interfaces/vehicle-type';
@Component({
  selector: 'app-vehicle-list-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './vehicle-list-form.component.html',
  styleUrl: './vehicle-list-form.component.css',
})
export class VehicleListFormComponent implements OnInit, OnDestroy {
  isEdit = false;
  vehicleForm!: FormGroup;
  authService = inject(AuthService);
  toastrService = inject(ToastrService);
  vehicleFormSubscription!: Subscription;
  paramSubscription!: Subscription;
  router = inject(Router);
  vehicleId: number = 0;
  vehicleType$:VehicleType[]=[];

  
selectedFile: File | null = null;
imagePreview: string | ArrayBuffer | null = null;
existingImageUrl: any | null = null;


  constructor(private fb: FormBuilder, private activeRouter: ActivatedRoute) {}

  onSubmit(): void {
    if (!this.isEdit) {
      if (this.vehicleForm.invalid) {
        this.toastrService.error('Please fill in all required fields correcly');
        return;
      }
      const formData = this.vehicleForm.value;
      this.authService.createVehicle(formData).subscribe({
        next: (response) => {
          this.onUpload();
          console.log('create respn : ', response);
          this.toastrService.success(response.message);
          this.router.navigateByUrl('/vehicle');
        },
        error: (err) => {
          this.toastrService.error(err.message);
        },
      });
    } else {
      if (this.vehicleForm.invalid) {
        this.toastrService.error(
          'please fill in all required fields correctly'
        );
        return;
      }

      this.authService
        .editVehicle(this.vehicleId, this.vehicleForm.value)
        .subscribe({
          next: (response) => {
            this.onUpload();
            this.toastrService.success(response.message);
            this.router.navigateByUrl('/vehicle');
          },
          error: (err) => {
            this.toastrService.error(err.error.message);
          },
        });
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
    
            this.vehicleForm.patchValue({
              vehicleImage: response.data.url,
            });
    
            this.authService.editVehicle(this.vehicleId, this.vehicleForm.value).subscribe({
              next: (response) => {
                this.toastrService.success(response.message);
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



  ngOnInit(): void {
    this.paramSubscription = this.activeRouter.params.subscribe({
      next: (response) => {
        console.log('id ', response['id']);
        this.vehicleId = response['id'];
        if (!this.vehicleId) return;
        this.authService.getByIdVehicle(this.vehicleId).subscribe({
          next: (response) => {
            this.existingImageUrl=response.vehicleImage;
            this.vehicleForm.patchValue(response);
            this.isEdit = true;
          },
          error: (err) => {
            this.toastrService.error(err.error.message);
          },
        });
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });

    this.vehicleForm = this.fb.group({
      vehicleBrand: ['', Validators.required],
      vehicleImage:'',
      vehicleModel: ['', Validators.required],
      vehicleCapacity: ['', Validators.required],
      vehicleRegistrationNo: ['', Validators.required],
      vehicleChassisNo: ['', Validators.required],
      vehicleLicence: ['', Validators.required],
      fitnessCertificateNo: [''],
      insurancePolicyNo: [''],
      fitnessExpiryDate: [null],
      insuranceExpiryDate: [null],
      registrationValidityDate: [null],
      lastMaintenanceDate: [null],
      fuelType: [''],
      odometerReading: [null],
      vehicleColor: [''],
      engineNumber: [''],
      ownerName: [''],
      vehicleAge: [null],
      lastServiceMileage: [null],
      vehicleStatus: [''],
      vehicleColorCode: [''],
      insuranceProvider: [''],
      vehicleModelYear: ['', Validators.required],
      isAvailableForBooking: [false],
      vehicleTypeId: [null, Validators.required],
    });
    this.authService.getVehicleTypeDetails().subscribe({
      next: (response) => {
        this.vehicleType$ = Array.isArray(response) ? response: [response];
      },
    });   
  
  }
  ngOnDestroy(): void {
    if (this.vehicleFormSubscription) {
      this.vehicleFormSubscription.unsubscribe();
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
