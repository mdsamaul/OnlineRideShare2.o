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
 
  
  ngOnInit(): void {
  //  console.log(this.accountDetail$);
      
  }
}
