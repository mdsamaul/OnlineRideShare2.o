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
 customerAccount$:any= undefined;
  
  ngOnInit(): void {
    this.authService.getDetail().subscribe({
      next:(res)=>{
        console.log(res);
        this.authService.getAllCustomer().subscribe({
          next:(allCustomer)=>{
            // console.log(res);
            allCustomer.forEach(customer => {
              if(customer.userId == res.id){
                console.log(customer);
               this.authService.getIdByCustomer(customer.customerId).subscribe({
                  next:(customerDetail)=>{
                    this.customerAccount$ = customerDetail;
                  }
                })
              }
            });
          }
        })
      }
    })
    
  }
}
