import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap, catchError } from 'rxjs/operators';
import { RatingComponent } from '../rating/rating.component';
import { RatingService } from '../../services/rating.service';
import { RideBook } from '../../interfaces/ride-book';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../interfaces/customer-response';
import { Observable } from 'rxjs';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
declare var L: any;

@Component({
  selector: 'app-ride-map',
  standalone: true,
  templateUrl: './ride-map.component.html',
  styleUrls: ['./ride-map.component.css'],
  imports: [CommonModule, FormsModule, RatingComponent],
})
export class RideMapComponent implements OnInit {
  rideBookId: number = 0;
  isMoving: boolean = false; // To control start/stop
  totalDistance: number = 0; // To track total distance
  intervalId: any;
  moveMarker: (() => void) | undefined = undefined; // Initialize with undefined
  isShowModal: boolean = false; // Modal visibility
  transactionAmount: number = 1; // Transaction ID
  selectedBankingMethod: string = ''; // Selected banking method
  currentRating: number = 0;
  customer$!: any;
  driver$!: any;
  firstRequest$!: any;
  isLoading: boolean = false;
  recipientEmail: string = 'samaul.isdb@gmail.com';
  subject: string = 'onlie ride share test';
  message: string = 'hellow';
  responseMessage: string = 'response';

  constructor(
    private authService: AuthService,
    private activatorRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ratingService: RatingService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatorRouter.params.subscribe({
      next: (params) => {
        console.log('RideBookId:', params['rideBookId']);
        this.rideBookId = params['rideBookId'];
        this.loadRideDetails();
      },
    });
  }

  private loadRideDetails(): void {
    this.authService.getRidebookId(this.rideBookId).subscribe({
      next: (rideDetails) => {
        // console.log('Ride Details:', rideDetails);

        if (typeof window !== 'undefined') {
          import('leaflet-routing-machine').then(() => {
            const sourceLatLng = L.latLng(
              rideDetails.sourceLatitude,
              rideDetails.sourceLongitude
            );
            const destinationLatLng = L.latLng(
              rideDetails.destinationLatitude,
              rideDetails.destinationLongitude
            );

            const map = L.map('map').setView(
              [rideDetails.sourceLatitude, rideDetails.sourceLongitude],
              13
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Create a circle beneath the marker
            const circle = L.circle(
              [rideDetails.sourceLatitude + 0.001, rideDetails.sourceLongitude],
              {
                color: 'red',
                fillColor: 'orange',
                fillOpacity: 0.5,
                radius: 50,
              }
            ).addTo(map);

            const marker = L.marker(sourceLatLng).addTo(map);

            const routingControl = L.Routing.control({
              waypoints: [sourceLatLng, destinationLatLng],
            }).addTo(map);

            routingControl.on('routeselected', (e: any) => {
              const selectedRoute = e.route;
              console.log('Selected Route:', selectedRoute);

              let currentIndex = 0;
              this.totalDistance = 0;

              // Movement logic
              this.moveMarker = () => {
                if (currentIndex < selectedRoute.coordinates.length - 1) {
                  const currentCoord = selectedRoute.coordinates[currentIndex];
                  const nextCoord = selectedRoute.coordinates[currentIndex + 1];

                  // Update marker position
                  marker.setLatLng([currentCoord.lat, currentCoord.lng]);

                  // Update the circle's position to match the marker
                  circle.setLatLng([currentCoord.lat, currentCoord.lng]);

                  // Calculate distance
                  const distance = map.distance(
                    L.latLng(currentCoord.lat, currentCoord.lng),
                    L.latLng(nextCoord.lat, nextCoord.lng)
                  );
                  this.totalDistance += distance;
                  this.transactionAmount =
                    this.transactionAmount * (this.totalDistance / 10000) + 50;
                  console.log(this.transactionAmount);
                  console.log(
                    `Moved: ${distance.toFixed(
                      2
                    )} meters, Total: ${this.totalDistance.toFixed(2)} meters`
                  );

                  currentIndex++;
                } else {
                  console.log('Reached Destination');
                  this.stopMovement();
                }
              };
            });

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const currentLat = position.coords.latitude;
                const currentLng = position.coords.longitude;
                marker.setLatLng([currentLat, currentLng]);
                circle.setLatLng([currentLat, currentLng]);

                // Optionally, you can update the map view to center on the device's current position
                map.setView([currentLat, currentLng], 13);
              },
              (error) => {
                console.error('Error fetching geolocation:', error);
              }
            );
          });
        }
      },
      error: (err) => {
        console.error('Error fetching ride details:', err);
      },
    });
  }

  // Start movement function
  public startMovement(): void {
    if (this.isMoving) {
      console.log('Already moving...');
      return;
    }
    this.isMoving = true;
    this.intervalId = setInterval(this.moveMarker!, 200); // Movement every 200ms
    console.log('Movement started...');
  }

  // Stop movement function
  public stopMovement(): void {
    if (!this.isMoving) {
      console.log('Movement is not active...');
      return;
    }
    clearInterval(this.intervalId); // Stop the movement
    this.isMoving = false;
    console.log('Movement stopped...');
  }

  rideBook: RideBook = {
    rideBookId: this.rideBookId,
    customerId: 0,
    driverVehicleId: 0,
    referenceName: '',
    referencePhoneNumber: '',
    sourceLocation: '',
    destinationLocation: '',
    startTime: '',
    endTime: '',
    totalFare: 0,
    isPaid: false,
    driverRating: 0,
    customerRating: 0,
    distanceInMeters: 0,
  };

  confirmPayment(): void {
    this.isLoading = true;
    if (!this.transactionAmount || !this.selectedBankingMethod) {
      alert('Please select a Payment method.');
      this.isLoading = false;
      return;
    }

    if (!this.rideBookId) {
      console.error('RideBookId is not set. Cannot create invoice.');
      this.isLoading = false;
      return;
    }
    if (this.authService.getUserDetail()?.roles == 'Driver') {
      this.ratingService.currentRating$.subscribe((rating) => {
        if (!this.rideBook) {
          console.error('RideBook data not found!');
          this.isLoading = false;
          return;
        }

        this.currentRating = rating;
        console.log('Driver Rating:', this.currentRating);

        console.log('RideBookId Before Conversion:', this.rideBookId);

        let idNumber: number = Number(this.rideBookId);
        if (isNaN(idNumber)) {
          console.error('Invalid RideBookId:', this.rideBookId);
          return; // এপিআই কল বন্ধ রাখুন
        }

        this.rideBook.customerRating = this.currentRating;
        this.rideBook.rideBookId = idNumber;
        this.authService.rating(idNumber, this.rideBook).subscribe(
          (res) => {
            console.log('Rating update success!');
          },
          (err) => {
            console.error('Failed to update rating:', err);
          }
        );
      });
    } else if (this.authService.getUserDetail()?.roles == 'Rider') {
      // this.ratingService.currentRating$.subscribe((rating) => {
      //   this.currentRating = rating; // রেটিং গ্রহণ করা
      //   console.log('rider Rating:', this.currentRating);
      // });
      this.ratingService.currentRating$.subscribe((rating) => {
        if (!this.rideBook) {
          console.error('RideBook data not found!');
          return;
        }

        this.currentRating = rating;
        console.log('Driver Rating:', this.currentRating);

        console.log('RideBookId Before Conversion:', this.rideBookId);

        let idNumber: number = Number(this.rideBookId);
        if (isNaN(idNumber)) {
          console.error('Invalid RideBookId:', this.rideBookId);
          return;
        }

        console.log('Converted ID:', idNumber);

        this.rideBook.customerRating = this.currentRating;
        this.rideBook.rideBookId = idNumber;
        this.authService.rating(idNumber, this.rideBook).subscribe(
          (res) => {
            console.log('Rating update success!');
          },
          (err) => {
            console.error('Failed to update rating:', err);
          }
        );
      });
    }

    this.cdr.detectChanges();
    // Prepare invoice data
    const invoiceData = {
      paymentAmount: 0,
      paymentUserId: '',
      paymentDate: new Date(),
      paymentStatus: 'Completed',
      invoiceId: 0,
      paymentTime: new Date(),
      invoiceAmount: 0,
      invoiceUserId: '',
      driverId: 101,
      customerId: 202,
      paymentMethodId: 1,
      particular: 'Ride completed and invoice generated',
    };

    this.authService
      .getRidebookId(this.rideBookId)
      .pipe(
        switchMap((resRidebook) => {
          invoiceData.customerId = resRidebook.customerId;
          console.log(resRidebook.customerId);
          this.authService
            .getIdByCustomer(resRidebook.customerId)
            .subscribe((resCustomer) => {
              console.log(resCustomer);
              this.customer$ = resCustomer;
            });
          return this.authService.getDriverVehicleId(
            resRidebook.driverVehicleId
          );
        }),
        switchMap((resDriverVehicle) => {
          console.log(resDriverVehicle.driverId);
          this.authService
            .getDriverById(resDriverVehicle.driverId)
            .subscribe((resDriver) => {
              console.log(resDriver);
              this.driver$ = resDriver;
            });
          invoiceData.driverId = resDriverVehicle.driverId;
          return this.authService.getByIdVehicle(resDriverVehicle.vehicleId);
        }),
        switchMap((resVehicle) => {
          return this.authService.getVehicleTypeById(resVehicle.vehicleTypeId);
        })
      )
      .subscribe({
        next: (resVehicleType) => {
          console.log(resVehicleType);

          // Update invoice data
          const totalFare =
            (this.totalDistance / 1000) * resVehicleType.perKmFare + 50;
          invoiceData.paymentAmount = totalFare;
          invoiceData.invoiceAmount = totalFare;
          this.transactionAmount = totalFare; // Update the transactionAmount for display

          // Create the invoice
          this.authService.createPaymentInvoice(invoiceData).subscribe({
            next: (response) => {
              console.log('Invoice created successfully:', response);

              this.authService
                .getAllRidebookRequest()
                .subscribe((resRidebookRequest) => {
                  console.log(resRidebookRequest);

                  this.firstRequest$ = resRidebookRequest
                    .filter(
                      (rq: any) =>
                        rq.driverId === this.driver$.driverId &&
                        rq.customerId === this.customer$.customerId
                    )
                    .sort((a: any, b: any) => b.requestId - a.requestId)[0]; // Descending এ sort করে প্রথমটিকে নেয়া

                  console.log(this.firstRequest$);
                });
              this.recipientEmail = this.customer$.customerEmail;
              console.log(this.recipientEmail);
              // alert('Invoice created successfully!');
              setTimeout(() => {
                //   this.message = `
                //   <div style="padding: 40px 20px; text-align: center; font-family: Arial, sans-serif; color: #fff; position:relative;">
                //     <table style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); color: #333; border: 5px solid transparent; border-image: linear-gradient(90deg, #4f46e5, #9333ea) 1;border-image-slice: 1;">
                //       <tr>
                //         <td style="text-align: center; background: linear-gradient(90deg, rgba(79, 70, 229, 1) 0%, rgba(147, 51, 234, 1) 100%); padding: 20px 0; border-radius: 8px;">
                //           <h2 style="color: #fff; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0;">
                //             Invoice
                //           </h2>
                //         </td>
                //       </tr>

                //       <!-- Greeting -->
                //       <tr>
                //         <td style="text-align: center; padding-top: 10px 0;">
                //           <h2 style="color: #4f46e5;">Dear ${
                //             this.customer$.customerName
                //           },</h2>
                //           <p style="font-size: 16px;;" >We are pleased to inform you that your ride has been successfully.</p>
                //         </td>
                //       </tr>

                //       <!-- Ride Details -->
                //       <tr>
                //         <td style="padding: 1px 0 5px 0; text-align: center;">
                //           <p style="font-size: 16px;"><strong>Pickup Location:</strong> <span style="color: #4f46e5;">${
                //             this.firstRequest$.sourceLocation
                //           }</span></p>
                //           <p style="font-size: 16px;  padding-left: 16px"><strong>Drop-off Location:</strong> <span style="color: #9333ea;">${
                //             this.firstRequest$.destinationLocation
                //           }</span></p>
                //         </td>
                //       </tr>

                //       <tr>
                //         <td style="display: flex; >
                //           <p style="font-size: 16px; "><strong>Total Km : </strong> <span style="color: #9333ea;">${(
                //             this.totalDistance / 1000
                //           ).toFixed(3)} KM</span></p>
                //           <p style="font-size: 16px;  padding-left: 16px"><strong>Estimated Fare:</strong> <span style="color: #16a34a; font-weight: bold;">${totalFare.toFixed(
                //             2
                //           )} BDT</span></p>
                //         </td>
                //       </tr>

                //       <!-- Payment Link -->
                //       <tr>
                //         <td style="text-align: center; background: linear-gradient(90deg, rgba(79, 70, 229, 1) 0%, rgba(147, 51, 234, 1) 100%); text-align: center; padding-bottom: 10px;">
                //           <a href="http://localhost:4200/payment" style="background: #4f46e5; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
                //             Click here to pay invoice
                //           </a>
                //         </td>
                //       </tr>

                //       <!-- Driver Information -->
                //       <tr>
                //         <td style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-top: 8px;">
                //           <p style="font-size: 16px;"><strong>Driver:</strong> <span style="color: #4f46e5;">${
                //             this.driver$.driverName
                //           }</span></p>
                //           <p style="font-size: 16px;"><strong>Contact:</strong> <span style="color: #9333ea;">${
                //             this.driver$.phoneNumber
                //           }</span></p>
                //         </td>
                //       </tr>

                //       <!-- Support Section -->
                //       <tr>
                //         <td style="text-align: center; padding-top: 10px;">
                //           <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
                //           <p style="font-size: 16px;"><strong>Company Name:</strong> Online Ride Share</p>
                //           <p style="font-size: 16px;"><strong>Customer Support:</strong>
                //             <a href="mailto:mdsamaul843@gmail.com" style="color: #4f46e5; text-decoration: none;">mdsamaul843@gmail.com</a> |
                //             <span style="color: #4f46e5;">01981154473</span>
                //           </p>
                //         </td>
                //       </tr>
                //     </table>
                //   </div>

                // `;
                this.message = `
              <div style="max-width: 600px; margin: auto; position: relative; padding: 10px; border-radius: 10px; overflow: hidden; background: linear-gradient(90deg, #4f46e5, #9333ea);">
                <div style="background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                  
                  <!-- Invoice Title -->
                  <h2 style="color: #4f46e5; text-align: center;">Invoice</h2>

                  <!-- Greeting -->
                  <p style="text-align: center; font-size: 16px; color: #333;">
                    Dear <span style="color: #4f46e5; font-weight: bold;">${
                      this.customer$.customerName
                    }</span>, your ride has been successfully completed.
                  </p>

                  <!-- Ride Details -->
                  <div style="padding-top: 10px; text-align: center;">
                    <p style="font-size: 16px;"><strong>Pickup Location:</strong> <span style="color: #4f46e5;">${
                      this.firstRequest$.sourceLocation
                    }</span></p>
                    <p style="font-size: 16px;"><strong>Drop-off Location:</strong> <span style="color: #9333ea;">${
                      this.firstRequest$.destinationLocation
                    }</span></p>
                  </div>

                  <div style="padding-bottom: 10px ; text-align: center;">
                    <p style="font-size: 16px;"><strong>Total Km:</strong> <span style="color: #9333ea;">250 KM</span></p>
                    <p style="font-size: 16px;"><strong>Estimated Fare:</strong> <span style="color: #16a34a; font-weight: bold;">${(
                      this.totalDistance / 1000
                    ).toFixed(3)} BDT</span></p>
                  </div>

                  <!-- Payment Link -->
                  <div style="text-align: center; padding: 15px;">
                    <a href="http://localhost:4200/payment" style="background: #4f46e5; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
                      Click here to pay invoice
                    </a>
                  </div>

                  <!-- Driver Information -->
                  <div style="display: flex; justify-content: space-between;  padding: 10px 0; background: #f9fafb; padding: 15px; border-radius: 10px; margin-top: 8px;">
                    <p style="font-size: 16px;"><strong>Driver:</strong> <span style="color: #4f46e5;">${
                      this.driver$.driverName
                    }</span></p>
                    <p style="font-size: 16px;"><strong>Contact:</strong> <span style="color: #9333ea;">${
                      this.driver$.phoneNumber
                    }</span></p>
                  </div>

                  <!-- Support Section -->
                  <div style="text-align: center; padding-top: 10px;">
                    <p style="font-size: 16px;">If you have any questions, feel free to contact us.</p>
                    <p style="font-size: 16px;"><strong>Company Name:</strong> Online Ride Share</p>
                    <p style="font-size: 16px;"><strong>Customer Support:</strong> 
                      <a href="mailto:mdsamaul843@gmail.com" style="color: #4f46e5; text-decoration: none;">mdsamaul843@gmail.com</a> | 
                      <span style="color: #4f46e5;">01981154473</span>
                    </p>
                  </div>                    

                </div>
              </div>
              
              `;

                const emailData = {
                  recipientEmail: this.recipientEmail,
                  subject: this.subject,
                  message: this.message,
                };
                console.log(emailData);
                this.authService.sendEmail(emailData).subscribe(
                  (response) => {
                    this.responseMessage = response.message;
                    this.toastrService.success(response.message);
                    this.isLoading = false;
                    this.router.navigateByUrl('/payment');
                  },
                  (error) => {
                    this.responseMessage = 'Failed to send email.';
                  }
                );
              }, 1000);

              // this.router.navigateByUrl('/payment');
            },
            error: (err) => {
              console.error('Error creating invoice:', err);
              alert('Failed to create invoice.');
            },
          });
        },
        error: (err) => {
          console.error('Error during invoice creation process:', err);
          alert('Failed to process payment.');
        },
      });

    // Stop movement if it's still active
    if (this.isMoving) {
      this.stopMovement();
    }
    console.log(invoiceData.invoiceAmount);
    console.log('Drop completed. Invoice creation initiated.');
  }
  showModal(): void {
    this.isShowModal = true;
    this.stopMovement();
  }

  // Close modal and reset values
  closeModal(): void {
    this.isShowModal = false;
    this.transactionAmount = 1;
    this.selectedBankingMethod = '';
    this.startMovement();
  }
}
