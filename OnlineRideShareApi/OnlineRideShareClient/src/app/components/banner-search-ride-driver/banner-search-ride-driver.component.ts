import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterComponent } from "../../pages/register/register.component";
import { RegisterFormComponent } from "../register-form/register-form.component";

@Component({
  selector: 'app-banner-search-ride-driver',
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    AsyncPipe,
    CommonModule,
    RegisterComponent,
    RegisterFormComponent
],
  templateUrl: './banner-search-ride-driver.component.html',
  styleUrl: './banner-search-ride-driver.component.css'
})

export class BannerSearchRideDriverComponent implements OnInit {
  searchVehicleForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.searchVehicleForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.searchVehicleForm.valid) {
      const { pickupLocation, dropoffLocation } = this.searchVehicleForm.value;
      this.router.navigate(['/search-vehicle-list'], {
        queryParams: { pickupLocation, dropoffLocation },
      });
    }
  }
}



