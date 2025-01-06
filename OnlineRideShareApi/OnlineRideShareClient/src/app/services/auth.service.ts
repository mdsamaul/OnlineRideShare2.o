import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, audit, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { UserDetail } from '../interfaces/user-detail';
import { RegisterRequest } from '../interfaces/RegisterRequest';
import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { CompanyCreateRequest } from '../interfaces/company-create-request';
import { DriverCreateRequest } from '../interfaces/driver-create-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data);
  }

  getDetail = (): Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.apiUrl}account/detail`);

forgotPassword=(email:string):Observable<AuthResponse> =>
  this.http.post<AuthResponse>(`${this.apiUrl}account/forgot-password`,{email});


resetPassword=(data:ResetPasswordRequest):Observable<AuthResponse> =>
  this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data);

changePassword=(data:ChangePasswordRequest):Observable<AuthResponse> =>
  this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data);

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    // return !this.isTokenExpired();
    return true;
  };

  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    // if (isTokenExpired) this.logout();
    // return isTokenExpired;
    return true;
  }

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  };

  logout = (): void => {
    localStorage.removeItem(this.userKey);
  };

  getAll = (): Observable<UserDetail[]> =>
    this.http.get<UserDetail[]>(`${this.apiUrl}account`);


  refreshToken = (data:{email:string; token:string; refreshToken:string}): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`,data);

  // getToken = (): string | null => localStorage.getItem(this.userKey) || '';

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // return localStorage.getItem('token');
      const user = localStorage.getItem(this.userKey);
      if(!user) return null;
      const userDetail : AuthResponse= JSON.parse(user);
      return userDetail.token;
    }
    console.warn('localStorage is not available on the server side.');
    return null;
  }
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      // return localStorage.getItem('token');
      const user = localStorage.getItem(this.userKey);
      if(!user) return null;
      const userDetail : AuthResponse= JSON.parse(user);
      return userDetail.refreshToken;
    }
    console.warn('localStorage is not available on the server side.');
    return null;
  }

 getCompany=():Observable<CompanyCreateRequest[]>=>
  this.http.get<CompanyCreateRequest[]>(`${this.apiUrl}Company`)
  
// addStudent=(data:Student)=> this.http.post(this.apiUrl,data);


 CreateCompany=(data:CompanyCreateRequest)=>
  this.http.post(`${this.apiUrl}company`, data);

 getCompanyById =(id:number):Observable<AuthResponse>=>
 this.http.get<AuthResponse>(`${this.apiUrl}company/`+id)
//  editStudent=(id:number,data:Student)=> this.http.put(this.apiUrl+'/'+id,data);

EditCompany=(id:number, data:CompanyCreateRequest):Observable<AuthResponse> =>
  this.http.put<AuthResponse>(`${this.apiUrl}company/`+id, data);
deleteCompany=(id:number):Observable<AuthResponse>=>
  this.http.delete<AuthResponse>(`${this.apiUrl}company/`+id);

// driver section
getDrivers= ():Observable<DriverCreateRequest[]>=>
  this.http.get<DriverCreateRequest[]>(`${this.apiUrl}driver`);

createDriver=(data : DriverCreateRequest):Observable<AuthResponse>=>
  this.http.post<AuthResponse>(`${this.apiUrl}driver`, data);
driverGetById =(id:number):Observable<AuthResponse>=>
  this.http.get<AuthResponse>(`${this.apiUrl}driver/`+id);
driverDelete = (id:number):Observable<AuthResponse>=>
  this.http.delete<AuthResponse>(`${this.apiUrl}driver/`+id);

driverEdit=(id:number, data:DriverCreateRequest):Observable<AuthResponse>=>
  this.http.put<AuthResponse>(`${this.apiUrl}driver/`+id,data);

}

