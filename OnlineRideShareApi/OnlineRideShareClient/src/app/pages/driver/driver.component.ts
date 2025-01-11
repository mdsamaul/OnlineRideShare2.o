import { CommonModule } from '@angular/common';
import { Component,  inject,  OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggle, MatSlideToggleModule  } from '@angular/material/slide-toggle'
import { response } from 'express';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [RouterModule, CommonModule,MatSlideToggle ,MatSlideToggleModule, FormsModule],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css'
})
export class DriverComponent implements OnInit{
 authService = inject(AuthService);
 toastrService = inject(ToastrService);
  drivers$!:Observable<DriverCreateRequest[]>;
  wonDrivers$:DriverCreateRequest[]=[];
  isAdmin$= false;
isAvailable =false;

  deleteDriver(id:number){
    console.log(id);
    this.authService.deleteDriver(id).subscribe({
      next:(response)=>{
        this.toastrService.success(response.message);
        this.getDriver();
        location.reload();
      },
      error:(err)=>{
        this.toastrService.error(err.error.message);
      }
    })
  }
  ngOnInit(): void {
    const user = this.authService.getUserDetail();
    console.log("driver ",user);
    if(user?.roles=='Admin'){
      this.isAdmin$=true;
    }else{
      console.log("un sub : ",this.authService.detailsDriver());
      this.authService.detailsDriver().subscribe({
        next:(response)=>{
          this.isAvailable= response[0].isAvailable;
          // console.log("this driver : ", response[0].isAvailable);
         this.wonDrivers$ = Array.isArray(response) ? response : [response];
        }
      })
    }
   
    this.getDriver();
  }
  driver = {
    isAvailable: false
  };
  private getDriver(): void{
    this.drivers$= this.authService.getDrivers();
  }
  toggleAvailability(id:number) {

    console.log(this.isAvailable)
    if(this.isAvailable){
      this.isAvailable=false;
    }else{
      this.isAvailable=true
    }
    console.log(this.isAvailable)
    // let isAvailable = !this.driver.isAvailable;
    console.log(`Driver is now ${this.isAvailable ? 'Online' : 'Offline'}`);
    // console.log(this.authService.setDriverStatus(1,false));
    this.authService.setDriverStatus(id, this.isAvailable).subscribe({
      next:(res)=>{
        this.toastrService.success(res.message);
      },error:(err)=>{
        this.toastrService.error(err.error.message);
      }
    })
    // console.log("won : ", id)
  }
}
