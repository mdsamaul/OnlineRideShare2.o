import { Component, inject } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import{MatToolbarModule} from '@angular/material/toolbar'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {MatMenuModule} from '@angular/material/menu'
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule, MatSnackBarModule, MatButtonModule, MatIcon, RouterLink , MatMenuModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  isLoggedIn (){
    return this.authService.isLoggedIn();
  }

  logout=()=>{
    this.authService.logout();
    this.matSnackBar.open('Logout success', "Close",{
      duration:5000,
      horizontalPosition:'center'
    })
    this.router.navigate(['/login']);
  }
}
