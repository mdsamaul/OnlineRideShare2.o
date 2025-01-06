import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { CompanyCreateRequest } from '../../interfaces/company-create-request';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit{
companies$!:Observable<CompanyCreateRequest[]>;
authService = inject(AuthService);
matSnackBar = inject(MatSnackBar);
constructor(private toastrService : ToastrService){

}
sid: number=0;
deleteCompany(id: number){
console.log(id);
this.authService.deleteCompany(id).subscribe({
  next:(response)=>{
    this.toastrService.success( response.message)
    this.getCompany();
    this.matSnackBar.open(response.message, 'Close',{
      duration:5000,
    });
  },error:(error:HttpErrorResponse)=>{
    this.toastrService.error('Delete successfully')
    this.matSnackBar.open(error.error.message,'Close',{
      duration:5000,
    });
  }
})

}
ngOnInit(): void {
//  console.log(this.authService.getCompany());
// this.authService.getCompany().subscribe({
//   next:(response)=>{
//     console.log(response);
//   },
//   error:(error:HttpErrorResponse)=>{
//     console.log(error.error.message);
//   }
// })

this.getCompany();
}

private getCompany(): void{
  this.companies$= this.authService.getCompany();
}
}
