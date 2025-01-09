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

@Component({
  selector: 'app-vehicle-type-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './vehicle-type-list.component.html',
  styleUrl: './vehicle-type-list.component.css'
})
export class VehicleTypeListComponent implements OnInit{
  
  authService = inject(AuthService);
  toastrService = inject(ToastrService);
  router = inject(Router);
  vehicleForm!:FormGroup;
  vehicleType$!: Observable<VehicleType[]>;
  vehicleTypeCount : number=0;
  isAdmin = false;
  onSubmit(){

  }
  deletevehicleType(id:number){
this.authService.deleteVehicleType(id).subscribe({
  next:(response)=>{
    this.toastrService.success(response.message);
    this.getVehicleType();
    // this.router.navigateByUrl('/vehicle');
  },
  error:(err)=>{
    this.toastrService.error(err.error.message);
  }
})
  }
 
  ngOnInit(): void {
    if(this.authService.getUserDetail()?.roles == 'Admin'){
    this.isAdmin=true;
    }
    // console.log("admin ",this.authService.getUserDetail()?.roles);
    this.getVehicleType();
  }
  private getVehicleType():void{
    this.vehicleType$= this.authService.getVehicleType();
  }
}
