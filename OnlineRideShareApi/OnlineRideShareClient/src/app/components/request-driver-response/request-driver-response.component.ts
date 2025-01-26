import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../interfaces/auth-response';
import { Customer } from '../../interfaces/customer-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-driver-response',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './request-driver-response.component.html',
  styleUrls: ['./request-driver-response.component.css']
})
export class RequestDriverResponseComponent implements OnInit {

  ridebookRequests$: any[] = [];
  customers$: any[] = [];
  isLoading = false;
  customerId$: number=0;
  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router : Router,
  ) {}

  ngOnInit(): void {

      this.acceptRequestDriver();
   
   

    this.authService.getAllCustomer().subscribe(res => {
      this.customers$ = res || []; 
      console.log(this.customers$);
    });
  }

  acceptRequest(requestId: number): void {
    if (!requestId) {
      this.toastrService.error('Invalid Request ID');
      return;
    }

    console.log('Accepting request with ID:', requestId);
    this.authService.acceptRideBookRequest(requestId, requestId).subscribe(res => {
      console.log(res);
      this.toastrService.success(res.message);      
      this.updateRequestStatus(requestId, 'Accepted');
      this.isLoading=true;
      this.CheckCustomerConfirm(requestId);
    }, error => {
      this.toastrService.error('Failed to accept request');
    });
  }

  rejectRequest(requestId: number): void {
    if (!requestId) {
      this.toastrService.error('Invalid Request ID');
      return;
    }

    // console.log('Rejecting request with ID:', requestId);
    
    this.authService.cancelRideBookRequest(requestId,requestId).subscribe(res => {
      // console.log(res);
      this.toastrService.success(res.message);      
      this.updateRequestStatus(requestId, 'Rejected');
      location.reload();
    }, error => {
      this.toastrService.error('Failed to reject request');
    });
  }

  private updateRequestStatus(requestId: number, status: string): void {
    const updatedRequest = this.ridebookRequests$.find(request => request.requestId === requestId);
    if (updatedRequest) {
      updatedRequest.status = status; 
    }
  }

  private acceptRequestDriver(): void {
   const interval = setInterval(() => {
    this.authService.getRidebookForDriver().subscribe(res => {
      console.log(res);
      this.ridebookRequests$ = res || []; 
      // console.log(this.ridebookRequests$);
      clearInterval(interval);
    }, error => {
      // this.toastrService.error('Failed to load ridebook requests');
    });
   }, 500);
  }

  private CheckCustomerConfirm(requestId:number):void{
    const interval = setInterval(() => {
      this.authService.getRequest(requestId).subscribe({
        next:(res)=>{
          if(res.requestStatus==='Confirmed' || res.requestStatus =='Referred'){
            clearInterval(interval);
            this.isLoading=false;
            console.log(res);
            // this.customerId$= res.customerId;
            // this.router.navigate(['/request-customer-details',requestId, res.customerId]);
            this.router.navigate(['/request-customer-details'], {
              queryParams: { requestId: requestId, customerId: res.customerId }
            });
          }
        }
      })
    }, 500);
  }
}
