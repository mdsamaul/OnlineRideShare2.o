import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
import { switchMap, forkJoin } from 'rxjs';
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
    MatButtonModule,
    MatIcon,
    RouterLink,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  showFiller = false;
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  currentUserAccount$: any = undefined;
  constructor(private toastrService: ToastrService) {}
  ngOnInit(): void {
   
    if(this.authService.getUserDetail()?.roles=='Rider'){
      this.authService.getAllCustomer().subscribe((resCustomer) => {
        resCustomer.forEach((customer) => {
          if (this.authService.getUserDetail()?.id == customer?.userId) {
            console.log(customer.customerImage);
            this.currentUserAccount$=customer;
          }
        });
      });
    }else if(this.authService.getUserDetail()?.roles=='Driver'){
      this.authService.getDrivers().subscribe((resDriver) => {
        resDriver.forEach((driver) => {
          if (this.authService.getUserDetail()?.id == driver?.userId) {
            console.log(driver.driverImage);
            this.currentUserAccount$=driver;
          }
        });
      });
    }else{
      console.log(this.authService.getUserDetail());
    }
    
   
    // this.authService.getAllCustomer().subscribe((resCustomer) => {
    //   resCustomer.forEach((customer) => {
    //     if (this.authService.getUserDetail()?.id == customer?.userId) {
    //       console.log(customer.customerImage);
    //       this.currentUserAccount$=customer;
    //     }
    //   });
    // });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  drawer: any;
  logout = () => {
    this.authService.logout();
    this.toastrService.success('Logout Successfully');
    this.matSnackBar.open('Logout success', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/login']);
    location.reload();
  };
}
