import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var L: any;

@Component({
  selector: 'app-ride-map',
  standalone: true,
  templateUrl: './ride-map.component.html',
  styleUrls: ['./ride-map.component.css'],
  imports: [CommonModule]
})
export class RideMapComponent implements OnInit {
  rideBookId: number = 0;
  isMoving: boolean = false; // To control start/stop
  totalDistance: number = 0; // To track total distance
  intervalId: any;
  moveMarker: (() => void) | undefined = undefined; // Initialize with undefined

  constructor(
    private authService: AuthService,
    private activatorRouter: ActivatedRoute
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





  // private loadRideDetails(): void {
  //   this.authService.getRidebookIf(this.rideBookId).subscribe({
  //     next: (rideDetails) => {
  //       console.log('Ride Details:', rideDetails);
  
  //       if (typeof window !== 'undefined') {
  //         import('leaflet-routing-machine').then(() => {
  //           const sourceLatLng = L.latLng(
  //             rideDetails.sourceLatitude,
  //             rideDetails.sourceLongitude
  //           );
  //           const destinationLatLng = L.latLng(
  //             rideDetails.destinationLatitude,
  //             rideDetails.destinationLongitude
  //           );
  
  //           const map = L.map('map').setView(
  //             [rideDetails.sourceLatitude, rideDetails.sourceLongitude],
  //             13
  //           );
  
  //           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //             attribution:
  //               '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //           }).addTo(map);
  
  //           // Create a circle beneath the marker
  //           const circle = L.circle([rideDetails.sourceLatitude + 0.001, rideDetails.sourceLongitude], {
  //             color: 'red',           // Border color
  //             fillColor: 'orange',    // Fill color
  //             fillOpacity: 0.5,       // Opacity of the circle fill
  //             radius: 50              // Radius of the circle
  //           }).addTo(map);
  
  //           const marker = L.marker(sourceLatLng).addTo(map);
  
  //           const routingControl = L.Routing.control({
  //             waypoints: [sourceLatLng, destinationLatLng],
  //           }).addTo(map);
  
  //           routingControl.on('routeselected', (e: any) => {
  //             const selectedRoute = e.route;
  //             console.log('Selected Route:', selectedRoute);
  
  //             let currentIndex = 0;
  //             this.totalDistance = 0;
  
  //             // Movement logic
  //             this.moveMarker = () => {
  //               if (currentIndex < selectedRoute.coordinates.length - 1) {
  //                 const currentCoord = selectedRoute.coordinates[currentIndex];
  //                 const nextCoord = selectedRoute.coordinates[currentIndex + 1];
  
  //                 // Update marker position
  //                 marker.setLatLng([currentCoord.lat, currentCoord.lng]);
  
  //                 // Update the circle's position to match the marker
  //                 circle.setLatLng([currentCoord.lat, currentCoord.lng]);
  
  //                 // Calculate distance
  //                 const distance = map.distance(
  //                   L.latLng(currentCoord.lat, currentCoord.lng),
  //                   L.latLng(nextCoord.lat, nextCoord.lng)
  //                 );
  //                 this.totalDistance += distance;
  //                 console.log(
  //                   `Moved: ${distance.toFixed(
  //                     2
  //                   )} meters, Total: ${this.totalDistance.toFixed(2)} meters`
  //                 );
  
  //                 currentIndex++;
  //               } else {
  //                 console.log('Reached Destination');
  //                 this.stopMovement(); // Stop when destination is reached
  //               }
  //             };
  //           });
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching ride details:', err);
  //     },
  //   });
  // }


  private loadRideDetails(): void {
    this.authService.getRidebookIf(this.rideBookId).subscribe({
      next: (rideDetails) => {
        console.log('Ride Details:', rideDetails);
  
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
            const circle = L.circle([rideDetails.sourceLatitude + 0.001, rideDetails.sourceLongitude], {
              color: 'red',
              fillColor: 'orange',
              fillOpacity: 0.5,
              radius: 50,
            }).addTo(map);
  
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
}
