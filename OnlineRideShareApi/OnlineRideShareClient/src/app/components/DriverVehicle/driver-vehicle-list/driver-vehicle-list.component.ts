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
  driverVehicel$! : DriverVehicle[];
  isAdmin=false;
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
    // this.driverVehicel$ = this.authService.getAllDriverVehicle();
    location.reload();
  },
  error:(err)=>{
    this.toastrService.error(err.error.message);
  }
})
}



  ngOnInit(): void {
    // this.authService.getAllDriverVehicle().subscribe({

    // })
    // console.log("get user details : ",this.authService.getUserDetail());
    if(this.authService.getUserDetail()?.roles== 'Admin'){
      this.isAdmin=true;
    }
    // this.driverVehicel$= 
   
    // console.log("driver vehicle : ",this.driverVehicel$)
    if(this.isAdmin){
      this.authService.getAllDriverVehicle().subscribe({
        next:(res)=>{
          // console.log("res : ",res);
          this.driverVehicel$=res;
        }
      })
      this.authService.getDrivers().subscribe({
        next:(res)=>{
          this.allDrivcer$= res;
        }
      })
      this.authService.getAllVehicle().subscribe({
        next:(res)=>{
          this.allVehicle$=res;
        }
      })
    }else{
      this.authService.detailsDriver().subscribe({
        next: (res) => {
          // console.log('driver ', res);
          this.allDrivcer$=res;
        },
      });
      this.authService.getVehicleDetails().subscribe({
        next: (res) => {
          // console.log('Vehicle Details ', res);
          this.allVehicle$=res;
        },
      });
      this.authService.detailsDriverVehicle().subscribe({
        next:(res)=>{
          console.log('driver detsila : ',res);
          this.driverVehicel$=res;
        }
      })
    }
   
    
  }
}
