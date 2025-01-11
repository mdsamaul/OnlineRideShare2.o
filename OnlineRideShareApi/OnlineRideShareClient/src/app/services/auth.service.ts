// import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';
// import { LoginRequest } from '../interfaces/login-request';
// import { Observable, audit, map } from 'rxjs';
// import { AuthResponse } from '../interfaces/auth-response';
// import { HttpClient } from '@angular/common/http';
// import { jwtDecode } from 'jwt-decode';
// import { UserDetail } from '../interfaces/user-detail';
// import { RegisterRequest } from '../interfaces/RegisterRequest';
// import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
// import { ChangePasswordRequest } from '../interfaces/change-password-request';
// import { CompanyCreateRequest } from '../interfaces/company-create-request';
// import { DriverCreateRequest } from '../interfaces/driver-create-request';
// import { VehicleType } from '../interfaces/vehicle-type';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   apiUrl: string = environment.apiUrl;
//   private userKey = 'user';

//   constructor(private http: HttpClient) {}

//   login(data: LoginRequest): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(`${this.apiUrl}account/login`, data)
//       .pipe(
//         map((response) => {
//           if (response.isSuccess) {
//             localStorage.setItem(this.userKey, JSON.stringify(response));
//           }
//           return response;
//         })
//       );
//   }

//   register(data: RegisterRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data);
//   }

//   getDetail = (): Observable<UserDetail> =>
//     this.http.get<UserDetail>(`${this.apiUrl}account/detail`);

// forgotPassword=(email:string):Observable<AuthResponse> =>
//   this.http.post<AuthResponse>(`${this.apiUrl}account/forgot-password`,{email});


// resetPassword=(data:ResetPasswordRequest):Observable<AuthResponse> =>
//   this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data);

// changePassword=(data:ChangePasswordRequest):Observable<AuthResponse> =>
//   this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data);

//   getUserDetail = () => {
//     const token = this.getToken();
//     if (!token) return null;
//     const decodedToken: any = jwtDecode(token);
//     const userDetail = {
//       id: decodedToken.nameid,
//       fullName: decodedToken.name,
//       email: decodedToken.email,
//       roles: decodedToken.role || [],
//     };

//     return userDetail;
//   };

//   isLoggedIn = (): boolean => {
//     const token = this.getToken();
//     if (!token) return false;
//     // return !this.isTokenExpired();
//     return true;
//   };

//   private isTokenExpired() {
//     const token = this.getToken();
//     if (!token) return true;
//     const decoded = jwtDecode(token);
//     const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
//     // if (isTokenExpired) this.logout();
//     // return isTokenExpired;
//     return true;
//   }

//   getRoles = (): string[] | null => {
//     const token = this.getToken();
//     if (!token) return null;

//     const decodedToken: any = jwtDecode(token);
//     return decodedToken.role || null;
//   };

//   logout = (): void => {
//     localStorage.removeItem(this.userKey);
//   };

//   getAll = (): Observable<UserDetail[]> =>
//     this.http.get<UserDetail[]>(`${this.apiUrl}account`);


//   refreshToken = (data:{email:string; token:string; refreshToken:string}): Observable<AuthResponse> =>
//     this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`,data);

//   // getToken = (): string | null => localStorage.getItem(this.userKey) || '';

//   getToken(): string | null {
//     if (typeof window !== 'undefined') {
//       // return localStorage.getItem('token');
//       const user = localStorage.getItem(this.userKey);
//       if(!user) return null;
//       const userDetail : AuthResponse= JSON.parse(user);
//       return userDetail.token;
//     }
//     console.warn('localStorage is not available on the server side.');
//     return null;
//   }
//   getRefreshToken(): string | null {
//     if (typeof window !== 'undefined') {
//       // return localStorage.getItem('token');
//       const user = localStorage.getItem(this.userKey);
//       if(!user) return null;
//       const userDetail : AuthResponse= JSON.parse(user);
//       return userDetail.refreshToken;
//     }
//     console.warn('localStorage is not available on the server side.');
//     return null;
//   }

//  getCompany=():Observable<CompanyCreateRequest[]>=>
//   this.http.get<CompanyCreateRequest[]>(`${this.apiUrl}Company`)
  
// // addStudent=(data:Student)=> this.http.post(this.apiUrl,data);


//  getCompany=(data:CompanyCreateRequest)=>
//   this.http.post(`${this.apiUrl}company`, data);

//  getCompanyById =(id:number):Observable<AuthResponse>=>
//  this.http.get<AuthResponse>(`${this.apiUrl}company/`+id)
// //  editStudent=(id:number,data:Student)=> this.http.put(this.apiUrl+'/'+id,data);

// EditCompany=(id:number, data:CompanyCreateRequest):Observable<AuthResponse> =>
//   this.http.put<AuthResponse>(`${this.apiUrl}company/`+id, data);
// deleteCompany=(id:number):Observable<AuthResponse>=>
//   this.http.delete<AuthResponse>(`${this.apiUrl}company/`+id);

// // driver section
// getDrivers= ():Observable<DriverCreateRequest[]>=>
//   this.http.get<DriverCreateRequest[]>(`${this.apiUrl}driver`);

// createDriver=(data : DriverCreateRequest):Observable<AuthResponse>=>
//   this.http.post<AuthResponse>(`${this.apiUrl}driver`, data);
// driverGetById =(id:number):Observable<AuthResponse>=>
//   this.http.get<AuthResponse>(`${this.apiUrl}driver/`+id);
// driverDelete = (id:number):Observable<AuthResponse>=>
//   this.http.delete<AuthResponse>(`${this.apiUrl}driver/`+id);

// driverEdit=(id:number, data:DriverCreateRequest):Observable<AuthResponse>=>
//   this.http.put<AuthResponse>(`${this.apiUrl}driver/`+id,data);


// //vehicle type 
// getVehicleType=():Observable<VehicleType[]>=>
//   this.http.get<VehicleType[]>(`${this.apiUrl}VehicleType`)

// //vehicle type post
// postVehicleType =(data: VehicleType):Observable<AuthResponse>=>
//   this.http.post<AuthResponse>(`${this.apiUrl}VehicleType`, data);

// editVehicleType = (id: number, data:VehicleType):Observable<AuthResponse>=> 
//   this.http.put<AuthResponse>(`${this.apiUrl}VehicleType/`+id, data);

// //vhecle type get by id
// getByIdVehicleType=(id:number):Observable<AuthResponse>=>
//   this.http.get<AuthResponse>(`${this.apiUrl}VehicleType/`+id)

// //vehicle type delete
// deleteVehicleType=(id:number):Observable<AuthResponse>=>
//   this.http.delete<AuthResponse>(`${this.apiUrl}VehicleType/`+id)

// //get vehicle type won user 
// getVehicletypeWonUser = (): Observable<VehicleType[]> =>
//   this.http.get<VehicleType[]>(`${this.apiUrl}VehicleType/details`);

// }

// import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';
// import { LoginRequest } from '../interfaces/login-request';
// import { Observable, catchError, map, of } from 'rxjs';
// import { AuthResponse } from '../interfaces/auth-response';
// import { HttpClient } from '@angular/common/http';
// import { jwtDecode } from 'jwt-decode';
// import { UserDetail } from '../interfaces/user-detail';
// import { RegisterRequest } from '../interfaces/RegisterRequest';
// import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
// import { ChangePasswordRequest } from '../interfaces/change-password-request';
// import { CompanyCreateRequest } from '../interfaces/company-create-request';
// import { DriverCreateRequest } from '../interfaces/driver-create-request';
// import { VehicleType } from '../interfaces/vehicle-type';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   apiUrl: string = environment.apiUrl;
//   private userKey = 'user';

//   constructor(private http: HttpClient) {}

//   // Login method
//   login(data: LoginRequest): Observable<AuthResponse | null> {
//     return this.http
//       .post<AuthResponse>(`${this.apiUrl}account/login`, data)
//       .pipe(
//         catchError(error => {
//           console.error(error);
//           return of(null); // Return null in case of error
//         }),
//         map((response: AuthResponse | null) => {
//           if (response?.isSuccess) {
//             localStorage.setItem(this.userKey, JSON.stringify(response));
//           }
//           return response; // Return response (null in case of error)
//         })
//       );
//   }

//   // Register method
//   register(data: RegisterRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data);
//   }

//   // Get user details
//   getDetail(): Observable<UserDetail> {
//     return this.http.get<UserDetail>(`${this.apiUrl}account/detail`);
//   }

//   // Password-related methods
//   forgotPassword(email: string): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/forgot-password`, { email });
//   }

//   resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data);
//   }

//   changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data);
//   }

//   // Get decoded user details from token
//   getUserDetail() {
//     const token = this.getToken();
//     if (!token) return null;
//     const decodedToken: any = jwtDecode(token);
//     return {
//       id: decodedToken.nameid,
//       fullName: decodedToken.name,
//       email: decodedToken.email,
//       roles: decodedToken.role || [],
//     };
//   }

//   // Check if the user is logged in
//   isLoggedIn(): boolean {
//     const token = this.getToken();
//     return token !== null;
//   }

//   // Get roles from token
//   getRoles(): string[] | null {
//     const token = this.getToken();
//     if (!token) return null;
//     const decodedToken: any = jwtDecode(token);
//     return decodedToken.role || null;
//   }

//   // Log out user
//   logout(): void {
//     localStorage.removeItem(this.userKey);
//   }

//   getAll = (): Observable<UserDetail[]> =>
//     this.http.get<UserDetail[]>(`${this.apiUrl}account`);
//   // Refresh token
//   refreshToken(data: { email: string; token: string; refreshToken: string }): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data);
//   }

//   // Get the token
//   private getUserProperty(property: string): string | null {
//     if (typeof window !== 'undefined') {
//       const user = localStorage.getItem(this.userKey);
//       if (!user) return null;
//       const userDetail: AuthResponse = JSON.parse(user);
//       return (userDetail as any)[property] || null;
//     }
//     console.warn('localStorage is not available on the server side.');
//     return null;
//   }

//   getToken(): string | null {
//     return this.getUserProperty('token');
//   }

//   getRefreshToken(): string | null {
//     return this.getUserProperty('refreshToken');
//   }

//   // Company methods
//   getCompany(): Observable<CompanyCreateRequest[]> {
//     return this.http.get<CompanyCreateRequest[]>(`${this.apiUrl}Company`);
//   }

//   createCompany(data: CompanyCreateRequest):Observable<AuthResponse>{
//     return this.http.post<AuthResponse>(`${this.apiUrl}company`, data);
//   }
//   getCompanyById(id: number): Observable<AuthResponse> {
//     return this.http.get<AuthResponse>(`${this.apiUrl}company/${id}`);
//   }

//   editCompany(id: number, data: CompanyCreateRequest): Observable<AuthResponse> {
//     return this.http.put<AuthResponse>(`${this.apiUrl}company/${id}`, data);
//   }

//   deleteCompany(id: number): Observable<AuthResponse> {
//     return this.http.delete<AuthResponse>(`${this.apiUrl}company/${id}`);
//   }

//   // Driver methods
//   getDrivers(): Observable<DriverCreateRequest[]> {
//     return this.http.get<DriverCreateRequest[]>(`${this.apiUrl}driver`);
//   }

//   createDriver(data: DriverCreateRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}driver`, data);
//   }

//   getDriverById(id: number): Observable<AuthResponse> {
//     return this.http.get<AuthResponse>(`${this.apiUrl}driver/${id}`);
//   }

//   deleteDriver(id: number): Observable<AuthResponse> {
//     return this.http.delete<AuthResponse>(`${this.apiUrl}driver/${id}`);
//   }

//   driverEdit(id: number, data: DriverCreateRequest): Observable<AuthResponse> {
//     return this.http.put<AuthResponse>(`${this.apiUrl}driver/${id}`, data);
//   }

//   // Vehicle Type methods
//   getVehicleType(): Observable<VehicleType[]> {
//     return this.http.get<VehicleType[]>(`${this.apiUrl}VehicleType`);
//   }

//   postVehicleType(data: VehicleType): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}VehicleType`, data);
//   }

//   editVehicleType(id: number, data: VehicleType): Observable<AuthResponse> {
//     return this.http.put<AuthResponse>(`${this.apiUrl}VehicleType/${id}`, data);
//   }

//   getVehicleTypeById(id: number): Observable<AuthResponse> {
//     return this.http.get<AuthResponse>(`${this.apiUrl}VehicleType/${id}`);
//   }

//   deleteVehicleType(id: number): Observable<AuthResponse> {
//     return this.http.delete<AuthResponse>(`${this.apiUrl}VehicleType/${id}`);
//   }

//   // Get vehicle type for the logged-in user
//   getVehicleTypeDetails(): Observable<VehicleType[]> {
//     return this.http.get<VehicleType[]>(`${this.apiUrl}VehicleType/details`);
//   }
// }

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { UserDetail } from '../interfaces/user-detail';
import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { CompanyCreateRequest } from '../interfaces/company-create-request';
import { DriverCreateRequest } from '../interfaces/driver-create-request';
import { VehicleType } from '../interfaces/vehicle-type';
import { RegisterRequest } from '../interfaces/RegisterRequest';
import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
import { jwtDecode } from 'jwt-decode';
import { VehicleDetails } from '../interfaces/vehicle-details';
import { DriverVehicle } from '../interfaces/driver-vehicle';
import { Customer } from '../interfaces/customer-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse | null> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        catchError(error => {
          console.error('Login failed', error);
          return of(null);
        }),
        map((response: AuthResponse | null) => {
          if (response?.isSuccess) {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem(this.userKey, JSON.stringify(response));
            }
            
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/register`, data)      
  }

  getDetail(): Observable<UserDetail> {
    return this.http
      .get<UserDetail>(`${this.apiUrl}account/detail`)
      .pipe(catchError(error => {
        console.error('Fetching user details failed', error);
        throw error;
      }));
  }
  getAll = (): Observable<UserDetail[]> =>
    this.http.get<UserDetail[]>(`${this.apiUrl}account`);


 
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/forgot-password`, { email })
      // .pipe(catchError(error => {
      //   console.error('Forgot password request failed', error);
      //   return of({ isSuccess: false, message: 'Forgot password request failed' } as AuthResponse);
      // }));
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/reset-password`, data)
      // .pipe(catchError(error => {
      //   console.error('Reset password failed', error);
      //   return of({ isSuccess: false, message: 'Reset password failed' } as AuthResponse);
      // }));
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/change-password`, data)
      // .pipe(catchError(error => {
      //   console.error('Change password failed', error);
      //   return of({ isSuccess: false, message: 'Change password failed' } as AuthResponse);
      // }));
  }

  getUserDetail() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      return {
        id: decodedToken.nameid,
        fullName: decodedToken.name,
        email: decodedToken.email,
        roles: decodedToken.role || [],
      };
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  getRoles(): string[] | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role || null;
    } catch (error) {
      console.error('Error decoding roles from token', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  refreshToken(data: { email: string; token: string; refreshToken: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data)
      // .pipe(catchError(error => {
      //   console.error('Token refresh failed', error);
      //   return of({ isSuccess: false, message: 'Token refresh failed' } as AuthResponse);
      // }));
  }

  private getUserProperty(property: string): string | null {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    try {
      const userDetail: AuthResponse = JSON.parse(user);
      return (userDetail as any)[property] || null;
    } catch (error) {
      console.error('Error fetching user property from localStorage', error);
      return null;
    }
  }

  getToken(): string | null {
    return this.getUserProperty('token');
  }

  getRefreshToken(): string | null {
    return this.getUserProperty('refreshToken');
  }

  getCompany(): Observable<CompanyCreateRequest[]> {
    return this.http
      .get<CompanyCreateRequest[]>(`${this.apiUrl}company`)
      .pipe(catchError(error => {
        console.error('Fetching companies failed', error);
        return of([]);
      }));
  }
  //company details 
detailsCompany(): Observable<CompanyCreateRequest[]>{
  return this.http.get<CompanyCreateRequest[]>(`${this.apiUrl}company/details`)
}

// getVehicleTypeDetails(): Observable<VehicleType[]> {
//   return this.http.get<VehicleType[]>(`${this.apiUrl}vehicletype/details`);
// }
  createCompany(data: CompanyCreateRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}company`, data)
      // .pipe(catchError(error => {
      //   console.error('Creating company failed', error);
      //   return of({ isSuccess: false, message: 'Creating company failed' } as AuthResponse);
      // }));
  }

  getCompanyById(id: number): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(`${this.apiUrl}company/${id}`)
      .pipe(catchError(error => {
        console.error('Fetching company by ID failed', error);
        throw error;
      }));
  }

  editCompany(id: number, data: CompanyCreateRequest): Observable<AuthResponse> {
    return this.http
      .put<AuthResponse>(`${this.apiUrl}company/${id}`, data)
      // .pipe(catchError(error => {
      //   console.error('Editing company failed', error);
      //   return of({ isSuccess: false, message: 'Editing company failed' } as AuthResponse);
      // }));
  }

  deleteCompany(id: number): Observable<AuthResponse> {
    return this.http
      .delete<AuthResponse>(`${this.apiUrl}company/${id}`)
      // .pipe(catchError(error => {
      //   console.error('Deleting company failed', error);
      //   return of({ isSuccess: false, message: 'Deleting company failed' } as AuthResponse);
      // }));
  }


  // Driver methods
  getDrivers(): Observable<DriverCreateRequest[]> {
    return this.http.get<DriverCreateRequest[]>(`${this.apiUrl}driver`);
  }
//driver details
detailsDriver (): Observable<DriverCreateRequest[]>{
  return this.http.get<DriverCreateRequest[]>(`${this.apiUrl}driver/details`);
}
  createDriver(data: DriverCreateRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}driver`, data);
  }

  getDriverById(id: number): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}driver/${id}`);
  }

  deleteDriver(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}driver/${id}`);
  }

  driverEdit(id: number, data: DriverCreateRequest): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}driver/${id}`, data);
  }

  //driver status online or offline

setDriverStatus(id:number, isAvailable:boolean):Observable<AuthResponse>{
   const url = `${this.apiUrl}driver/${id}/SetStatus`;
   return this.http.patch<AuthResponse>(url, null,  { params: { isAvailable: isAvailable } });
}

  // Vehicle Type methods
  getVehicleType(): Observable<VehicleType[]> {
    return this.http.get<VehicleType[]>(`${this.apiUrl}vehicletype`);
  }

  postVehicleType(data: VehicleType): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}vehicletype`, data);
  }

  editVehicleType(id: number, data: VehicleType): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}vehicletype/${id}`, data);
  }

  getVehicleTypeById(id: number): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}vehicletype/${id}`);
  }

  deleteVehicleType(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}vehicletype/${id}`);
  }

  // Get vehicle type details for the logged-in user
  getVehicleTypeDetails(): Observable<VehicleType[]> {
    return this.http.get<VehicleType[]>(`${this.apiUrl}vehicletype/details`);
  }

  //vehicle
  //get vehicle
  getAllVehicle():Observable<VehicleDetails[]>{
    return this.http.get<VehicleDetails[]>(`${this.apiUrl}Vehicle`)
  }
  //post vehicle
  createVehicle(data: VehicleDetails): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}Vehicle`,data)
  }
  
  //edit vehicel
  editVehicle(id:number, data: VehicleDetails):Observable<AuthResponse>{
    return this.http.put<AuthResponse>(`${this.apiUrl}Vehicle/${id}`, data)
  }

  //get by id

  getByIdVehicle(id:number):Observable<AuthResponse>{
    return this.http.get<AuthResponse>(`${this.apiUrl}Vehicle/${id}`)
  }
  //delete vehicle
  deleteVehicle(id:number):Observable<AuthResponse>{
    return this.http.delete<AuthResponse>(`${this.apiUrl}Vehicle/${id}`)
  }

  //get details vehicle
  getVehicleDetails():Observable<VehicleDetails[]>{
    return this.http.get<VehicleDetails[]>(`${this.apiUrl}Vehicle/details`)
  }

  //driver vehicle
getAllDriverVehicle(): Observable<DriverVehicle[]>{
 return this.http.get<DriverVehicle[]>(`${this.apiUrl}DriverVehicles`)
}

//driver vehicle post
createDriverVehicle(data: DriverVehicle):Observable<AuthResponse>{
  return this.http.post<AuthResponse>(`${this.apiUrl}DriverVehicles`, data)
}

//driver vehicle id
getDriverVehicleId(id:number):Observable<AuthResponse>{
  return this.http.get<AuthResponse>(`${this.apiUrl}DriverVehicles/${id}`);
}

//edit driver vehicle 
editDriverVehicle(id:number, data:DriverVehicle):Observable<AuthResponse>{
  return this.http.put<AuthResponse>(`${this.apiUrl}DriverVehicles/${id}`, data)
}

//delete driver vehcile
deleteDriverVehicle(id:number):Observable<AuthResponse>{
  return this.http.delete<AuthResponse>(`${this.apiUrl}DriverVehicles/${id}`);
}
//details driver vehicle
detailsDriverVehicle():Observable<AuthResponse>{
  return this.http.get<AuthResponse>(`${this.apiUrl}DriverVehicles`)
}

//customer

getAllCustomer():Observable<Customer[]>{
  return this.http.get<Customer[]>(`${this.apiUrl}Cusomer`);
}
//get specif user 
detaislCustomer():Observable<Customer[]>{
  return this.http.get<Customer[]>(`${this.apiUrl}Cusomer/details`)
}

//create customer
createCustomer(data : Customer):Observable<AuthResponse>{
  return this.http.post<AuthResponse>(`${this.apiUrl}Cusomer`, data)
}

//edit customer
editCustomer(id:number, data:Customer):Observable<AuthResponse>{
  return this.http.put<AuthResponse>(`${this.apiUrl}Cusomer/${id}`,data)
}
//get by id customer
getIdByCustomer(id: number):Observable<AuthResponse>{
  return this.http.get<AuthResponse>(`${this.apiUrl}Cusomer/${id}`)
}

//delete 
deleteCustomer(id: number):Observable<AuthResponse>{
  return this.http.delete<AuthResponse>(`${this.apiUrl}Cusomer/${id}`)
}
//customer er current location 
sendLocationToApi(latitude:number, longitude:number):Observable<AuthResponse>{
  const url = `${this.apiUrl}Cusomer/update-location`;
  return this.http.post<AuthResponse>(url,{latitude:latitude, longitude:longitude});
}
}
