import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, switchMap, catchError } from 'rxjs/operators';
declare var L: any;

@Component({
  selector: 'app-ride-map',
  standalone: true,
  templateUrl: './ride-map.component.html',
  styleUrls: ['./ride-map.component.css'],
  imports: [
    CommonModule, 
    FormsModule,
    
  ],
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


  constructor(
    private authService: AuthService,
    private activatorRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
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
                  this.transactionAmount=(this.transactionAmount*(this.totalDistance/10000)) + 50;
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



  confirmPayment(): void {
    if (!this.transactionAmount || !this.selectedBankingMethod) {
      alert('Please select a Payment method.');
      return;
    }
  
    if (!this.rideBookId) {
      console.error('RideBookId is not set. Cannot create invoice.');
      return;
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
  
    this.authService.getRidebookId(this.rideBookId).pipe(
      switchMap((resRidebook) => {
        invoiceData.customerId = resRidebook.customerId;
        return this.authService.getDriverVehicleId(resRidebook.driverVehicleId);
      }),
      switchMap((resDriverVehicle) => {
        console.log(resDriverVehicle.driverId)
        invoiceData.driverId = resDriverVehicle.driverId;
        return this.authService.getByIdVehicle(resDriverVehicle.vehicleId);
      }),
      switchMap((resVehicle) => {
        return this.authService.getVehicleTypeById(resVehicle.vehicleTypeId);
      })
    ).subscribe({
      next: (resVehicleType) => {
        console.log(resVehicleType);
  
        // Update invoice data
        const totalFare = this.totalDistance / 1000 * resVehicleType.perKmFare + 50;
        invoiceData.paymentAmount = totalFare;
        invoiceData.invoiceAmount = totalFare;
        this.transactionAmount = totalFare; // Update the transactionAmount for display
  
        // Create the invoice
        this.authService.createPaymentInvoice(invoiceData).subscribe({
          next: (response) => {
            console.log('Invoice created successfully:', response);
            // alert('Invoice created successfully!');
            // this.authService.
            this.router.navigateByUrl('/payment');
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
  showModal():void{
    this.isShowModal = true;
    this.stopMovement();
  }

  // Close modal and reset values
  closeModal(): void {
    this.isShowModal = false;
    this.transactionAmount =1;
    this.selectedBankingMethod = '';
    this.startMovement();
  }
  
}  
