import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';
import { DriverVehicle } from '../../../interfaces/driver-vehicle';
import { VehicleDetails } from '../../../interfaces/vehicle-details';
import { Observable, Subscription } from 'rxjs';
import { DriverCreateRequest } from '../../../interfaces/driver-create-request';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-driver-vehicle-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    AsyncPipe,
  ],
  templateUrl: './driver-vehicle-form.component.html',
  styleUrl: './driver-vehicle-form.component.css',
})
export class DriverVehicleFormComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);

  allDriver$!: Observable<DriverCreateRequest[]>;
  allVehicle$!: Observable<VehicleDetails[]>;

  driverVehicleid = 0;

  vehicleForm!: FormGroup;

  vehicleDriverSubscription!: Subscription;
  paramDriverSubscription!: Subscription;

  isEdit = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private activetorRouter: ActivatedRoute
  ) {}
  

  onSubmit() {

    if(!this.isEdit){
      this.authService.createDriverVehicle(this.vehicleForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.toastrService.success(res.message);
          this.router.navigateByUrl('driver-vehicle');
        },
        error: (err) => {
          this.toastrService.error(err.error.message);
        },
      });
    }else{
      if(this.vehicleForm.invalid){
        this.toastrService.error(
          'please fill in all required fields correctly'
        );
        return;
      }
      this.authService.editDriverVehicle(this.driverVehicleid, this.vehicleForm.value).subscribe({
        next:(res)=>{
          this.toastrService.success(res.message);
          this.router.navigateByUrl('driver-vehicle');
        },error:(err)=>{
          this.toastrService.error(err.error.message);
        }
      })
    }

    
  }
  ngOnInit(): void {

    this.paramDriverSubscription = this.activetorRouter.params.subscribe({
      next:(res)=>{
        console.log(res['id']);
        this.driverVehicleid= res['id'];
        if(!this.driverVehicleid) return;
        this.authService.getDriverVehicleId(this.driverVehicleid).subscribe({
          next:(res)=>{
           this.vehicleForm.patchValue(res);
           this.isEdit=true;
          },
          error:(err)=>{
            this.toastrService.error(err.error.message);
          }
        })
      }
    })


    this.allDriver$ = this.authService.detailsDriver();
    this.allVehicle$ = this.authService.getVehicleDetails();

    this.vehicleForm = this.fb.group({
      driverId: ['', Validators.required],
      vehicleId: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    if(this.vehicleDriverSubscription){
      this.vehicleDriverSubscription.unsubscribe();
    }
    if(this.paramDriverSubscription){
      this.paramDriverSubscription.unsubscribe;
    }
  }
}
