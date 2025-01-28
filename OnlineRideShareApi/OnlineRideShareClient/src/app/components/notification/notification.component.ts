import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  authService = inject(AuthService);

  notifications: any[] = [];

  isOpen = false;

  ngOnInit(): void {
    setInterval(() => {
      this.authService.getRidebookForDriver().subscribe(res=>{
        this.notifications=res;
      })
    }, 500);
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  clearNotifications() {
    this.notifications = [];
  }
}
