import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
import { NotificationComponent } from "../notification/notification.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    CommonModule,
    RouterLink,
    NotificationComponent
],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showFiller = false;
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  currentUserAccount$: any = {};
  constructor(private toastrService: ToastrService) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetail();
    if (userDetails?.roles === 'Rider') {
      this.authService.getAllCustomer().subscribe((resCustomer) => {
        this.currentUserAccount$ = resCustomer.find(
          (customer) => customer.userId === userDetails.id
        ) || {};
      });
    } else if (userDetails?.roles === 'Driver') {
      this.authService.getDrivers().subscribe((resDriver) => {
        this.currentUserAccount$ = resDriver.find(
          (driver) => driver.userId === userDetails.id
        ) || {};
      });
    } else {
      console.log('User details:', userDetails);
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout = () => {
    this.authService.logout();
    this.toastrService.success('Logout Successfully');
    this.matSnackBar.open('Logout success', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/login']).then(() => {
      window.location.href = '/login';
    });
  };
}
