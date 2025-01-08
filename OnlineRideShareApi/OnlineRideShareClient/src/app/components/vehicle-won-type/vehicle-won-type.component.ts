import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { VehicleType } from '../../interfaces/vehicle-type';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-won-type',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule],
  templateUrl: './vehicle-won-type.component.html',
  styleUrls: ['./vehicle-won-type.component.css'],
})
export class VehicleWonTypeComponent implements OnInit {
  authService = inject(AuthService);
  toastrService = inject(ToastrService);
  router = inject(Router);
  isAdmin$ = false;
  vehicleType$!: Observable<VehicleType[]>;
  userId$: string | number | null = null;
  newVehicleType$: VehicleType[] = []; // Change from Observable to array
  islentgh$ = false;
  wonVehicleType$ :VehicleType[]=[];

  ngOnInit(): void {
    // Retrieve user details and vehicle types on initialization
    this.authService.getDetail();
   const user = this.authService.getUserDetail();
    this.userId$ =user?.id;
    this.getVehicleType();
    console.log("user  : ",user);
    if(user!.roles === 'Admin'){
      this.isAdmin$=true;
    }
    // Process vehicle types
    this.vehicleType$.subscribe((elements) => {
      // console.log('Vehicle types:', elements);
      this.newVehicleType$ = elements; // Assign fetched elements to the array
      // console.log('New array:', this.newVehicleType$);
      // console.log('user id : ', this.userId$);
      this.wonVehicleType$ = this.newVehicleType$.filter(
        (a) => a.userId == this.userId$
      );
      // console.log('Filtered array:', this.wonVehicleType$);
      this.islentgh$ = this.wonVehicleType$.length > 0;
    });
  }

  addNewVehicleType(newVehicle: VehicleType): void {
    // Add a new vehicle type to the array
    this.newVehicleType$.push(newVehicle);
    // console.log('Updated array:', this.newVehicleType$);
  }

  deleteVehicleType(id: number): void {
    // Delete vehicle type and refresh the list
    this.authService.deleteVehicleType(id).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        this.newVehicleType$ = this.newVehicleType$.filter(
          (vehicle) => vehicle.userId !== this.userId$
        ); // Remove from array
        // console.log('After deletion:', this.newVehicleType$);
        location.reload();
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });
  }

  private getVehicleType(): void {
    // Fetch vehicle types
    this.vehicleType$ = this.authService.getVehicleType();
  }
}
