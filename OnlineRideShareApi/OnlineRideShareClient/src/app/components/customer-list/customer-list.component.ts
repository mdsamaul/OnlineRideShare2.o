import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../interfaces/auth-response';
import { Customer } from '../../interfaces/customer-response';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, AsyncPipe],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {

 authService = inject(AuthService);
 isAdmin$= false;
 allUser$= this.authService.getUserDetail();
 detailCustomer$!:any[];
 allCustomer$ = this.authService.getAllCustomer();
 toastrService = inject(ToastrService);
 ngOnInit(): void {
  if(this.allUser$?.roles=="Admin"){
  this.isAdmin$=true;
  this.detailCustomer$=[];
  }else{    
     this.authService.detaislCustomer().subscribe({
      next:(res)=>{
        this.detailCustomer$=res;
      }
     });
  }
 
//  console.log(this.detailCustomer$);
}

deleteCustomer(id:number){
this.authService.deleteCustomer(id).subscribe({
  next:(response)=>{
    this.toastrService.success(response.message);
   this.authService.detaislCustomer().subscribe({
    next:(res)=>{
      this.detailCustomer$ = res;
    }
   });
  },error:(err)=>{
    this.toastrService.error(err.message);
  }
});
}
}
