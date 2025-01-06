import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'path';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { roleGuard } from './guards/role.guard';
import { RoleComponent } from './pages/role/role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CompanyComponent } from './pages/company/company.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { DriverComponent } from './pages/driver/driver.component';
import { DriverFormComponent } from './components/driver-form/driver-form.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
   { path:'login', component: LoginComponent},
   {path:'register', component:RegisterComponent},
   {path:'account/:[id]', component:AccountComponent,
    canActivate:[authGuard]
   },
   {path:'user', component:UsersComponent,
    canActivate:[roleGuard],
    data:{
        roles:['Admin']
    }
   },
  
   {path:'role', component:RoleComponent,
    canActivate:[roleGuard],data:{
        roles:['Admin']
    }
   },
   {path:'forget-password', component:ForgetPasswordComponent},
   {path:'reset-password', component:ResetPasswordComponent},
   {path:'change-password', component:ChangePasswordComponent, canActivate:[authGuard]},
     {
    path:'company', component:CompanyComponent,
    canActivate:[authGuard],
    // data:{
    //     roles:['User']
    // }
   },
   {path:'company/form', component:CompanyFormComponent , canActivate:[authGuard] },
   {path:'company/:id', component:CompanyFormComponent , canActivate:[authGuard] },
   //driver
   {path:'driver', component:DriverComponent, canActivate:[authGuard]},
   //driver form
   {path:'driver/form',component:DriverFormComponent, canActivate:[authGuard]},
   {path:'driver/:id',component:DriverFormComponent, canActivate:[authGuard]}

];
