import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ride-search-view',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule, CommonModule,
    ReactiveFormsModule 
],
  templateUrl: './ride-search-view.component.html',
  styleUrl: './ride-search-view.component.css'
})
export class RideSearchViewComponent implements OnInit{
  authService = inject(AuthService);
  searchVehicleForm!:FormGroup;
  constructor(
    private router: Router,
    private fb:FormBuilder
  ){}
  ngOnInit(): void {
    this.searchVehicleForm = this.fb.group({
      pickupLocation: ['', Validators.required], // Set up form controls
      dropoffLocation: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.searchVehicleForm.valid) {
      const formData = this.searchVehicleForm.value;
      this.router.navigate(['/search-vehicle-list'], {
        queryParams: {
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation
        }
      });
    }
  }
}
