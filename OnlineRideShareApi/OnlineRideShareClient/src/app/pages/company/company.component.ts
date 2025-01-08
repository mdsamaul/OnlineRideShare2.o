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
import { MatCardModule } from '@angular/material/card';
import { CompleterResult } from 'readline';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [AsyncPipe, RouterLink, CommonModule, MatCardModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit{
companies$!:Observable<CompanyCreateRequest[]>;
companiesDetails$!: Observable<CompanyCreateRequest[]>;
authService = inject(AuthService);
matSnackBar = inject(MatSnackBar);
newCompanies$:CompanyCreateRequest[]=[];
isAdmin = false;
constructor(private toastrService : ToastrService){}
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
  const user = this.authService.getUserDetail();
  console.log("user com: ", user);
  if(user?.roles==='Admin'){
    this.isAdmin=true;
  }else{
    console.log("company data ",this.newCompanies$);
    this.authService.detailsCompany().subscribe({
      next:(response)=>{
        this.newCompanies$= response;
        console.log('get cmp : ',this.newCompanies$);
      }
    })
  }
 
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
private getCompanyDetais(): void{
  this.companiesDetails$ = this.authService.detailsCompany();
}
}
