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
import { VehicleComponent } from './pages/vehicle/vehicle.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleTypeFormComponent } from './components/vehicle-type-form/vehicle-type-form.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleListFormComponent } from './components/vehicle-list-form/vehicle-list-form.component';
import { DriverVehicleComponent } from './pages/driver-vehicle/driver-vehicle.component';
import { DriverVehicleFormComponent } from './components/DriverVehicle/driver-vehicle-form/driver-vehicle-form.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerGetLocatioinComponent } from './components/customer-get-locatioin/customer-get-locatioin.component';
import { SearchVehicleListComponent } from './components/search-vehicle-list/search-vehicle-list.component';
import { RequestDriverResponseComponent } from './components/request-driver-response/request-driver-response.component';
import { RequestDriverDetailsComponent } from './components/request-driver-details/request-driver-details.component';
import { RequestCustomerDetailsComponent } from './components/request-customer-details/request-customer-details.component';
import { RideTrackComponent } from './pages/ride-track/ride-track.component';
import { PaymentComponent } from './pages/payment/payment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'account/:[id]',
    component: AccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user',
    component: UsersComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },

  {
    path: 'role',
    component: RoleComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [authGuard],
    // data:{
    //     roles:['User']
    // }
  },
  {
    path: 'company/form',
    component: CompanyFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'company/:id',
    component: CompanyFormComponent,
    canActivate: [authGuard],
  },
  //driver
  { path: 'driver', component: DriverComponent, canActivate: [authGuard] },
  //driver form
  {
    path: 'driver/form',
    component: DriverFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'driver/:id',
    component: DriverFormComponent,
    canActivate: [authGuard],
  },
  //vehicle type
  { path: 'vehicle', component: VehicleComponent, canActivate: [authGuard] },
  {
    path: 'vehicle-list/form',
    component: VehicleListFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'vehicle-list/:id',
    component: VehicleListFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'vehicle-type/form',
    component: VehicleTypeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'vehicle-type/:id',
    component: VehicleTypeFormComponent,
    canActivate: [authGuard],
  },

  //driver vehicle
  {
    path: 'driver-vehicle',
    component: DriverVehicleComponent,
    canActivate: [authGuard],
  },
  {
    path: 'driver-vehicle-form',
    component: DriverVehicleFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'driver-vehicle-form/:id',
    component: DriverVehicleFormComponent,
    canActivate: [authGuard],
  },

  //customer
  { path: 'customer', component: CustomerComponent, canActivate: [authGuard] },
  //customer form
  {
    path: 'customer-list/form',
    component: CustomerFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customer-list/:id',
    component: CustomerFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'set/location',
    component: CustomerGetLocatioinComponent,
    canActivate: [authGuard],
  },

  //search vehicle
  { path: 'search-vehicle-list', component: SearchVehicleListComponent },

  //redebook request
  {
    path: 'request-driver-response',
    component: RequestDriverResponseComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Driver', 'Admin'],
    },
  },
  {
    path: 'request-driver-details/:requestId',
    component: RequestDriverDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'request-customer-details',
    component: RequestCustomerDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ride-track/:rideBookId',
    component: RideTrackComponent,
    canActivate: [authGuard],
  },
  {
    path:'payment', component:PaymentComponent,canActivate:[authGuard]
  }
];
