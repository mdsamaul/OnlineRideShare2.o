import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { VehicleType } from '../../interfaces/vehicle-type';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VehicleDetails } from '../../interfaces/vehicle-details';
import { response } from 'express';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css',
})
export class VehicleListComponent implements OnInit {
  authService = inject(AuthService);
  toastrService = inject(ToastrService);
  router = inject(Router);
  vehicleForm!: FormGroup;
  vehicleType$!: Observable<VehicleDetails[]>;
  vt$!: VehicleType[];
  vehicleTypeCount: number = 0;
  isAdmin = false;
  newVehicle$: VehicleDetails[] = [];
  onSubmit() {}

  ngOnInit(): void {
    if (this.authService.getUserDetail()?.roles == 'Admin') {
      this.isAdmin = true;
    }
    // console.log("admin ",this.authService.getUserDetail()?.roles);
    if (this.isAdmin) {
      this.authService.getAllVehicle().subscribe({
        next: (response) => {
          this.newVehicle$ = response;
          console.log('vehicle all : on : ', response);
        },
      });
    } else {
      this.authService.getVehicleDetails().subscribe({
        next: (response) => {
          console.log('details ', response);
          this.newVehicle$ = response;
        },
      });
    }
    this.authService.getVehicleType().subscribe({
      next: (response) => {
        this.vt$= response;
      },
      error: (err) => {
        console.error("Error fetching vehicle types: ", err);
      }
    });
    
  
  }

  deleteVehicle(id: number) {
    this.authService.deleteVehicle(id).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        this.newVehicle$ = this.newVehicle$.filter(
          (vehicle) => vehicle.vehicleId !== id
        );
      },
      error: (err) => {
        this.toastrService.error(err.message);
      },
    });
  }
}
