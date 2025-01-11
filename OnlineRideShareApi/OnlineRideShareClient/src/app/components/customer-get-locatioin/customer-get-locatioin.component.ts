import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-get-locatioin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-get-locatioin.component.html',
  styleUrl: './customer-get-locatioin.component.css'
})
export class CustomerGetLocatioinComponent {
  authService=inject(AuthService);
  toastrService= inject(ToastrService);
  route = inject(Router);
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.authService.sendLocationToApi(latitude, longitude).subscribe({
            next: (res) => {
              // console.log(res);
              this.toastrService.success(res.message);
              this.route.navigateByUrl('/customer');
            },
            error: (err) => {
              // console.log(err.message);
              this.toastrService.error(err.message);
            },
          });
        },
        (error) => {
          this.toastrService.error(error.message);
        }
      );
    } else {
      this.toastrService.warning(
        'Geolocation is not supported by this browser.'
      );
      console.log('Geolocation is not supported by this browser.');
    }
  }
}
