import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { VehicleDetails } from '../../interfaces/vehicle-details';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { createRequest } from '../../interfaces/create-request';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-vehicle-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './search-vehicle-list.component.html',
  styleUrls: ['./search-vehicle-list.component.css'],
})
export class SearchVehicleListComponent implements OnInit {
  pickupLocation!: string;
  dropoffLocation!: string;
  searchVehicleForm!: FormGroup;
  requestId:number=0;
  nearByDriverList: any[] = [];
  nearByVehicleList$!: Observable<VehicleDetails[]>;
  drivers$!: Observable<DriverCreateRequest[]>;

  hoveredCardIndex: number | null = null;
  clickedCardIndex: number | null = null;

  isLoading = false;
  selectedDriverId: number | null = null;
  isRequestSent = false;
  customerId: number | null = null;

  authService = inject(AuthService);
  toastrService = inject(ToastrService);

  constructor(private activatorRouter: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchQueryParams();
    this.fetchNearbyDrivers();
    this.fetchAllDriversAndVehicles();
  }

  private initializeForm(): void {
    this.searchVehicleForm = new FormGroup({
      pickupLocation: new FormControl(''),
      dropoffLocation: new FormControl(''),
    });
  }
  private fetchQueryParams(): void {
    this.activatorRouter.queryParams.subscribe((params) => {
      if (params['pickupLocation'] && params['dropoffLocation']) {
        this.searchVehicleForm.patchValue({
          pickupLocation: params['pickupLocation'],
          dropoffLocation: params['dropoffLocation'],
        });
      }
      this.pickupLocation = this.searchVehicleForm.value.pickupLocation;
      this.dropoffLocation = this.searchVehicleForm.value.dropoffLocation;
    });
  }

  private fetchNearbyDrivers(): void {
    this.isLoading = true;
    this.authService.nearbyDriverSearchSourceCustomerLocation(this.pickupLocation, this.dropoffLocation)
      .subscribe({
        next: (res) => {
          this.nearByDriverList = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching nearby drivers:', err);
          this.isLoading = false;
        },
      });
  }

  private fetchAllDriversAndVehicles(): void {
    this.drivers$ = this.authService.getDrivers();
    this.nearByVehicleList$ = this.authService.getAllVehicle();
  }

  handleHover(index: number | null): void {
    if (this.clickedCardIndex === null || this.clickedCardIndex === index) {
      this.hoveredCardIndex = index;
    }
  }

  selectDriver(id: number): void {
    if (this.clickedCardIndex === id) {
      this.clickedCardIndex = null; 
      this.authService.cancelRidebookRequest(this.requestId,this.requestId).subscribe({
        next:(res)=>{
          console.log(res);
          this.toastrService.success(res.message);
        },error:(err)=>{
          console.log(err.message);
          this.toastrService.error(err.message);
        }
      })
    } else {
      this.clickedCardIndex = id;
      console.log("false");
    
        if (!this.authService.isLoggedIn()) {
          this.toastrService.warning("your are first loing");
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url },
          });
          return;
        }
    
        this.selectedDriverId = id;
        this.isRequestSent = true;
    
        const createRequestValue: createRequest = {
          driverId: id,
          userId: '', 
          sourceLocation: this.pickupLocation,
          destinationLocation: this.dropoffLocation,
        };
    
        this.authService.createRequest(createRequestValue).subscribe({
          next: (res) => {
            this.requestId= res.requestId;
            console.log('Request created successfully:', res.requestId);
            this.toastrService.success(res.message);
            this.checkDriverResponse(res.requestId);
          },
          error: (err) => {
            console.error('Error creating request:', err);
            this.toastrService.error(err.message);
            this.isRequestSent = false;
          },
        });      
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.nearbyDriverSearchSourceCustomerLocation(
      this.searchVehicleForm.value.pickupLocation,
      this.searchVehicleForm.value.dropoffLocation
    ).subscribe({
      next: (res) => {
        this.nearByDriverList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error on form submit:', err);
        this.isLoading = false;
      },
    });
  }

  private checkDriverResponse(requestId: number): void {
    console.log("request id : ",requestId);
    const interval = setInterval(() => {
      this.authService.getRequest(requestId).subscribe({
        next: (response) => {
          if (response.requestStatus === 'Accepted') {
            clearInterval(interval);
            console.log('Request successfully processed.');
            this.toastrService.success('Request successfully processed.');
            this.router.navigateByUrl('/');
          } else if (response.requestStatus === 'Cancelled') {
            clearInterval(interval);
            this.clickedCardIndex = null;
            console.log('Request canceled.');
            this.toastrService.success('Request canceled. again vehicle request');
          }
        },
        error: (err) => {
          console.error('Error checking driver response:', err);
          clearInterval(interval); // Stop on error
        },
      });
    }, 5000); 
  }
}
