import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent implements OnInit, OnDestroy{
  authService = inject(AuthService);
  vehicleTForm!: FormGroup;
  isVTEdit=false;
  vehicleTypeId:number=0;
  vehicleFormSubscription!: Subscription;
  paramSubsctiption!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router : Router,
    private toastrService : ToastrService,
    private activatedRouter: ActivatedRoute
  ){}
  ngOnDestroy(): void {
   if(this.vehicleFormSubscription){
    this.vehicleFormSubscription.unsubscribe();
   }
   if(this.paramSubsctiption){
    this.paramSubsctiption.unsubscribe();
   }
  }
  ngOnInit(): void {
    this.vehicleTForm= this.fb.group({
      // :['', Validators.required],
    })
  }
  onVTSubmit(){
    if(!this.isVTEdit){
      if(this.vehicleTForm.invalid){
        this.toastrService.error("Please fill in all required fields correcly");
      }
      return;
    }
    const fromVtData = this.vehicleTForm.value;
    console.log(fromVtData);
    

  }
}
