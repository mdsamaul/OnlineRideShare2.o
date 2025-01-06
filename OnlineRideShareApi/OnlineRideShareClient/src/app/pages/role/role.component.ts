import { Component, inject, OnInit } from '@angular/core';
import { RoleFormComponent } from "../../components/role-form/role-form.component";
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/RoleCreateRequest';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [RoleFormComponent,AsyncPipe, MatSelectModule, MatInputModule,RoleListComponent, RoleFormComponent, MatSnackBarModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {

roleService = inject(RoleService);
authService = inject(AuthService);
errorMessage='';
role:RoleCreateRequest = {} as RoleCreateRequest;
roles$ = this.roleService.getRoles();
snackBar= inject(MatSnackBar);
users$ = this.authService.getAll();
selectedUser:string ='';
selectedRole:string ='';
createRole(role: RoleCreateRequest){
  this.roleService.createRole(role).subscribe({
    next:(response:{message:string})=>{
      this.roles$= this.roleService.getRoles();
      this.snackBar.open('Role Create Successfully','ok', {
        duration:5000,
      });
    },
    error:(error:HttpErrorResponse)=>{
      if(error.status == 400){
        this.errorMessage = error.error;
      }
    }
  })
}



deleteRole(id:string){
this.roleService.delete(id).subscribe({
  next:(response)=>{
    this.roles$= this.roleService.getRoles();
    this.snackBar.open('Role Deleted Successfully', 'close',{
      duration:3000
    })
  },
  error:(error:HttpErrorResponse)=>{
    this.snackBar.open(error.message, 'close',{
      duration:3000
    })
  }
})
}

assignRole(){
  this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
    next:(response)=>{
      this.roles$= this.roleService.getRoles();
      this.snackBar.open('Role Assign Successfully', 'close',{
        duration:3000
      })
    },
    error:(error:HttpErrorResponse)=>{
      this.snackBar.open(error.message, 'close',{
        duration:3000
      })
    }
  })
}
}
