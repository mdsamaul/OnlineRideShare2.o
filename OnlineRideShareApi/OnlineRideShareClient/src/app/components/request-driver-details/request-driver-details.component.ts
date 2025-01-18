import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { DriverCreateRequest } from '../../interfaces/driver-create-request';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../interfaces/customer-response';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-driver-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './request-driver-details.component.html',
  styleUrls: ['./request-driver-details.component.css'],
})
export class RequestDriverDetailsComponent implements OnInit {
  requestId!: number; // Declare requestId to hold the value from the URL
  driverDetails$!: DriverCreateRequest; // Correct type for Observable
  isMyselfModalOpen: boolean = false;
  isReferModalOpen: boolean = false;
  isContactModalOpen: boolean = false;
  customer$!: Customer;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private activatedrouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetching requestId from the route params
    this.activatedrouter.params.subscribe({
      next: (res) => {
        console.log('Route params:', res['requestId']);
        this.requestId = res['requestId'];
        this.reDriverDetails(); // Call reDriverDetails after receiving requestId
      },
      error: (err) => {
        console.error('Error fetching route params:', err);
      },
    });
  }

  contactDriver(): void {
    // Logic for contacting the driver
    console.log('Contacting driver...');
  }

  private reDriverDetails(): void {
    // Fetching driver details using the requestId
    this.authService.getDriverContact(this.requestId).subscribe({
      next: (res) => {
        this.driverDetails$ = res; // Wrap the res into an Observable
        console.log('Driver Details:', res);
      },
      error: (err) => {
        console.error('Error fetching driver details:', err);
      },
    });
  }

  openContactModal(): void {
    this.isMyselfModalOpen = true; // Open modal
  }

  closeContactModal(): void {
    this.isMyselfModalOpen = false; // Close modal
  }

  bookRideForSelf(): void {
    console.log('Ride booked for yourself.');
    // this.closeContactModal(); // Modal বন্ধ করার জন্য
    // console.log(this.authService.getUserDetail());
    this.isLoading=true;
    this.authService
      .customerConfirmRequest(this.requestId, this.requestId)
      .subscribe((res) => {
        console.log(res);
        this.isLoading=false;
        this.isContactModalOpen=true;
        this.isMyselfModalOpen = false;
        this.isReferModalOpen=false;
      });
  }

  referRideToSomeone(): void {
    console.log('Ride referred to someone.');
    this.isReferModalOpen = true;
    this.isMyselfModalOpen = false;
    this.isContactModalOpen=false;
  }
  user = {
    Name: '',
    Phone: '',
  };
  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Data:', this.user);
      this.isLoading = true;
      this.authService.referCustomer(this.requestId, this.user).subscribe({
        next: (res) => {
          console.log(res);
          this.isReferModalOpen = false;
          this.isMyselfModalOpen = false;
          this.isContactModalOpen=true;
          this.isLoading=false;
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
