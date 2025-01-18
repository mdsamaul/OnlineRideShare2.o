// import { Component, OnInit } from '@angular/core';
// import { Customer } from '../../interfaces/customer-response';
// import { AuthService } from '../../services/auth.service';
// import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs'; // Observable import
// import { AsyncPipe, CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule } from '@angular/material/dialog';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { RideBookRequest } from '../../interfaces/ridebook-request';
// import { ToastrService } from 'ngx-toastr';
// import { RideBook } from '../../interfaces/ride-book';

// @Component({
//   selector: 'app-request-customer-details',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatButtonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     FormsModule,
//   ],
//   templateUrl: './request-customer-details.component.html',
//   styleUrls: ['./request-customer-details.component.css'],
// })
// export class RequestCustomerDetailsComponent implements OnInit {
//   customerId!: number;
//   requestId!: number;
//   customers$: Customer[] = []; // Observable type for customers
//   isMyselfModalOpen: boolean = false;
//   customerPhone: string = '';
//   requestData!: RideBookRequest; // New property to hold request data
//   rideBook: RideBook = {
//     rideBookId: 0,
//     customerId: 0,
//     driverVehicleId: 0,
//     referenceName: null,
//     referencePhoneNumber: null,
//     sourceLatitude: 0,
//     sourceLongitude: 0,
//     destinationLatitude: 0,
//     destinationLongitude: 0,
//     startTime: '',
//     endTime: '',
//     totalFare: 0,
//     isPaid: false,
//     driverRating: null,
//     customerRating: null,
//     distanceInMeters: 0
//   };

//   constructor(
//     private authService: AuthService,
//     private activatorRouter: ActivatedRoute,
//     private toastrService: ToastrService
//   ) {}

//   ngOnInit(): void {
//     this.activatorRouter.queryParamMap.subscribe((params) => {
//       const requestId = params.get('requestId');
//       const customerId = params.get('customerId');
//       console.log('Request ID:', requestId); // Verify if requestId is received
//       console.log('Customer ID:', customerId); // Verify if customerId is received

//       if (requestId && customerId) {
//         this.requestRidebook(Number(requestId), Number(customerId)); // Pass both IDs
//       } else {
//         console.error('requestId or customerId is missing');
//       }
//     });

//     this.getAllCustomer();
//   }

//   private getAllCustomer(): void {
//     this.authService.getAllCustomer().subscribe(
//       (data) => {
//         console.log('Customers:', data); // Check the data coming from API
//         this.customers$ = data;
//       },
//       (error) => {
//         console.error('API Error:', error); // Handle API errors
//       }
//     );
//   }

//   private requestRidebook(id: number, customerId: number): void {
//     if (id && customerId) {
//       this.authService.getRequest(id).subscribe({
//         next: (res) => {
//           console.log(res);
//           this.requestData = res;
//         },
//         error: (err) => {
//           console.error('API call error:', err);
//         },
//       });
//     } else {
//       console.error('Invalid requestId or customerId');
//     }
//   }

//   openContactModal(): void {
//     this.isMyselfModalOpen = true;
//   }

//   pickupConfirmed(): void {
//     if (this.customerPhone) {
//       this.authService.getRequest(this.requestData.requestId).subscribe({
//         next: (res) => {
//           this.customers$.forEach((customer) => {
//             if (res.customerId == customer.customerId) {
//               if (res.requestStatus == 'Referred') {
//                 if (this.customerPhone == res.referredCustomerPhone) {
//                   // Populate the rideBook object with necessary details
//                   this.rideBook.customerId = res.customerId;
//                   this.authService.getDriverVehicleId(res.driverId).subscribe({

//                   })
//                   // this.rideBook.driverVehicleId = res.; 
//                   // this.rideBook.referenceName = this.requestData.referredCustomerName; // Populate with actual customer info
//                   // this.rideBook.referencePhoneNumber = this.requestData.referredCustomerPhone;
//                   // this.rideBook.sourceLatitude = res.sourceLatitude;
//                   // this.rideBook.sourceLongitude = res.sourceLongitude;
//                   // this.rideBook.destinationLatitude = res.destinationLatitude;
//                   // this.rideBook.destinationLongitude = res.destinationLongitude;
//                   // this.rideBook.startTime = new Date().toISOString(); // Example of setting start time
//                   // this.rideBook.endTime = ''; // Will be populated later
//                   // this.rideBook.totalFare = '0'; // Example of setting default fare
//                   // this.rideBook.isPaid = false; // Default
//                   // this.rideBook.driverRating = ''; // Default
//                   // this.rideBook.customerRating = ''; // Default
//                   // this.rideBook.distanceInMeters = '0'; // Example

//                   // Now send the rideBook data to the API
//                   this.authService.confirmPickup(
//                     this.requestData.requestId, this.requestData.requestId,
//                   ).subscribe({
//                     next: (res) => {
//                       this.isMyselfModalOpen = false;
//                       this.toastrService.success(res.message);
//                       console.log('confirm : and ride book init : ', res);
//                     },
//                     error: (err) => {
//                       console.error('API call error:', err);
//                     },
//                   });
//                 } else {
//                   this.toastrService.warning(
//                     'Refer Customer not found with matching phone number'
//                   );
//                   console.log('Refer Customer not found with matching phone number');
//                 }
//               } else if (this.customerPhone === customer.customerPhoneNumber) {
//                 // Same approach to populate the rideBook object before confirming
//                 this.rideBook.customerId = res.customerId;
//                 this.rideBook.driverVehicleId = res.driverVehicleId;
//                 // Similarly populate other fields

//                 this.authService
//                   .confirmPickup(
//                     this.requestData.requestId,
//                     this.rideBook
//                   )
//                   .subscribe({
//                     next: (res) => {
//                       this.isMyselfModalOpen = false;
//                       this.toastrService.success(res.message);
//                       console.log('confirm : ', res);
//                     },
//                     error: (err) => {
//                       console.error('API call error:', err);
//                     },
//                   });
//               } else {
//                 this.toastrService.warning(
//                   'Refer Customer not found with matching phone number'
//                 );
//                 console.log('Customer not found with matching phone number');
//               }
//             } else {
//               console.log('Customer not found');
//             }
//           });
//         },
//         error: (err) => {
//           console.log(err.message);
//         },
//       });
//     } else {
//       alert('Please enter a valid phone number.');
//     }
//   }

//   closeContactModal(): void {
//     this.isMyselfModalOpen = false;
//   }
// }



import { Component, OnInit } from '@angular/core';
import { Customer } from '../../interfaces/customer-response';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs'; // Observable import
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RideBookRequest } from '../../interfaces/ridebook-request';
import { ToastrService } from 'ngx-toastr';
import { RideBook } from '../../interfaces/ride-book';

@Component({
  selector: 'app-request-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './request-customer-details.component.html',
  styleUrls: ['./request-customer-details.component.css'],
})
export class RequestCustomerDetailsComponent implements OnInit {
  customerId!: number;
  requestId!: number;
  customers$: Customer[] = []; // Observable type for customers
  isMyselfModalOpen: boolean = false;
  customerPhone: string = '';
  requestData!: RideBookRequest; // New property to hold request data
  rideBook: RideBook = {
    rideBookId: 0,
    customerId: 0,
    driverVehicleId: 0,
    referenceName: null,
    referencePhoneNumber: null,
    sourceLocation: '',
    destinationLocation: '',
    startTime: '',
    endTime: '',
    totalFare: 0,
    isPaid: false,
    driverRating: null,
    customerRating: null,
    distanceInMeters: 0
  };

  constructor(
    private authService: AuthService,
    private activatorRouter: ActivatedRoute,
    private toastrService: ToastrService,
    private router : Router,
  ) {}

  ngOnInit(): void {
    this.activatorRouter.queryParamMap.subscribe((params) => {
      const requestId = params.get('requestId');
      const customerId = params.get('customerId');
      this.rideBook.startTime = new Date().toISOString();
      this.rideBook.endTime = new Date().toISOString();
      if (requestId && customerId) {
        this.requestRidebook(Number(requestId), Number(customerId)); // Pass both IDs
      } else {
        console.error('requestId or customerId is missing');
      }
    });

    this.getAllCustomer();
  }
  private getAllCustomer(): void {
    this.authService.getAllCustomer().subscribe(
      (data) => {
        console.log('Customers:', data); // Check the data coming from API
        this.customers$ = data;
      },
      (error) => {
        console.error('API Error:', error); // Handle API errors
      }
    );
  }

  private requestRidebook(id: number, customerId: number): void {
    if (id && customerId) {
      this.authService.getRequest(id).subscribe({
        next: (res) => {         
        this.rideBook.customerId= res.customerId;
        this.rideBook.referenceName= res.referredCustomerName!;
        this.rideBook.referencePhoneNumber= res.referredCustomerPhone!; 
        this.rideBook.sourceLocation=res.sourceLocation!;
        this.rideBook.destinationLocation=res.destinationLocation!;
        this.authService.getAllDriverVehicle().subscribe({
          next:(response)=>{
            response.forEach(driverVehicle => {
              if(driverVehicle.driverId == res.driverId){
                console.log(driverVehicle);  
                this.rideBook.driverVehicleId=driverVehicle.driverVehicleId;
              }
            });            
          }
        })
          this.requestData = res;
        },
        error: (err) => {
          console.error('API call error:', err);
        },
      });
    } else {
      console.error('Invalid requestId or customerId');
    }
  }

  openContactModal(): void {
    this.isMyselfModalOpen = true;
  }

  pickupConfirmed(): void {
    if (this.customerPhone) {
      this.authService.getRequest(this.requestData.requestId).subscribe({
        next: (res) => {
          this.customers$.forEach((customer) => {
            if (res.customerId == customer.customerId) {              

              if (res.requestStatus == 'Referred') {
                if (this.customerPhone == res.referredCustomerPhone) {
                  this.authService
                    .confirmPickup(
                      this.requestData.requestId,
                      this.requestData.requestId
                    )
                    .subscribe({
                      next: (res) => {
                        // console.log(this.rideBook);
                        this.authService.createRideBook(this.rideBook).subscribe({
                          next:(res)=>{
                            console.log(res);
                            this.router.navigateByUrl('/ride-track');
                          }
                        })
                        this.isMyselfModalOpen = false;
                        this.toastrService.success(res.message);
                        console.log('confirm : and ride book init : ', res);
                      },
                      error: (err) => {
                        console.error('API call error:', err);
                      },
                    });
                } else {
                  this.toastrService.warning(
                    'Refer Customer not found with matching phone number'
                  );
                  console.log(
                    'Refer Customer not found with matching phone number'
                  );
                }
              } else if (this.customerPhone === customer.customerPhoneNumber) {
                this.authService
                  .confirmPickup(
                    this.requestData.requestId,
                    this.requestData.requestId
                  )
                  .subscribe({
                    next: (res) => {
                      this.authService.createRideBook(this.rideBook).subscribe({
                        next:(res)=>{
                          console.log(res);
                          this.router.navigateByUrl('/ride-track');
                        }
                      })
                      this.isMyselfModalOpen = false;
                      this.toastrService.success(res.message);
                      console.log('confirm : ', res);
                    },
                    error: (err) => {
                      console.error('API call error:', err);
                    },
                  });
              } else {
                this.toastrService.warning(
                  'Refer Customer not found with matching phone number'
                );
                console.log('Customer not found with matching phone number');
              }
            } else {
              console.log('customer not faund');
            }
          });
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    } else {
      alert('Please enter a valid phone number.');
    }
  }

  closeContactModal(): void {
    this.isMyselfModalOpen = false;
  }
}