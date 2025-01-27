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
  currentUserAccount$:any= undefined;
  
  ngOnInit(): void {
   
    if(this.authService.getUserDetail()?.roles=='Driver'){
      this.authService.getDrivers().subscribe({
        next:(allDriver)=>{
          allDriver.forEach(deiver => {
            if(deiver.userId == this.authService.getUserDetail()?.id){
              console.log(deiver);
            this.currentUserAccount$=deiver;
            }
          });
        }
      })    
    }
    if(this.authService.getUserDetail()?.roles=='Rider'){
      this.authService.getAllCustomer().subscribe({
        next:(allCustomer)=>{
          allCustomer.forEach(customer => {
            if(customer.userId == this.authService.getUserDetail()?.id){
              console.log(customer);
            this.currentUserAccount$=customer;
            }
          });
        }
      })    
    }
        
  }
}
