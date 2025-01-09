import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DriverCreateRequest } from '../../../interfaces/driver-create-request';
import { VehicleDetails } from '../../../interfaces/vehicle-details';
import { Observable } from 'rxjs';
import { DriverVehicle } from '../../../interfaces/driver-vehicle';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-driver-vehicle-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatSelectModule, RouterLink],
  templateUrl: './driver-vehicle-list.component.html',
  styleUrl: './driver-vehicle-list.component.css',
})
export class DriverVehicleListComponent implements OnInit {
  authService = inject(AuthService);
  allDrivcer$!:DriverCreateRequest[];
  allVehicle$!:VehicleDetails[];
  driverVehicel$!: Observable<DriverVehicle[]>;
constructor(
  private toastrService :ToastrService,
  private router: Router
){}
deleteItem(id: number){
this.authService.deleteDriverVehicle(id).subscribe({
  next:(res)=>{
    console.log(res);
    this.toastrService.success(res.message);
    this.router.navigateByUrl('driver-vehicle');
    this.driverVehicel$= this.authService.getAllDriverVehicle();
  },
  error:(err)=>{
    this.toastrService.error(err.error.message);
  }
})
}



  ngOnInit(): void {
    // this.authService.getAllDriverVehicle().subscribe({

    // })
    this.driverVehicel$= this.authService.getAllDriverVehicle()
    this.authService.detailsDriver().subscribe({
      next: (res) => {
        console.log('driver ', res);
        this.allDrivcer$=res;
      },
    });
    this.authService.getVehicleDetails().subscribe({
      next: (res) => {
        console.log('Vehicle Details ', res);
        this.allVehicle$=res;
      },
    });
  }
}
