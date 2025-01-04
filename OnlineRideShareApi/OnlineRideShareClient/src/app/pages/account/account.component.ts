import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
 
  authService = inject(AuthService);
  accountDetail$ = this.authService.getDetail();
 
  // this.yourService.getDetail().subscribe(
  //   (data) => {
  //     console.log('Fetched User Detail:', data);
  //     this.userDetail = data; // Response থেকে Data Store করা হচ্ছে
  //   },
  ngOnInit(): void {
   console.log(this.accountDetail$);
      
  }
}
