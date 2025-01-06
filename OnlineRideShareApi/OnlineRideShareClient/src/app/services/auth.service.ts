import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { UserDetail } from '../interfaces/user-detail';
import { RegisterRequest } from '../interfaces/RegisterRequest';
import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { CompanyCreateRequest } from '../interfaces/company-create-request';

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

}


// import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';
// import { LoginRequest } from '../interfaces/login-request';
// import { Observable, map, catchError, throwError } from 'rxjs';
// import { AuthResponse } from '../interfaces/auth-response';
// import { HttpClient } from '@angular/common/http';
// import { jwtDecode } from 'jwt-decode';
// import { UserDetail } from '../interfaces/user-detail';
// import { RegisterRequest } from '../interfaces/RegisterRequest';
// import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
// import { ChangePasswordRequest } from '../interfaces/change-password-request';
// import { CompanyCreateRequest } from '../interfaces/company-create-request';

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
//         }),
//         catchError((error) => {
//           console.error('Login error', error);
//           return throwError(() => new Error('Login failed'));
//         })
//       );
//   }

//   register(data: RegisterRequest): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(`${this.apiUrl}account/register`, data)
//       .pipe(
//         catchError((error) => {
//           console.error('Registration error', error);
//           return throwError(() => new Error('Registration failed'));
//         })
//       );
//   }

//   getDetail(): Observable<UserDetail> {
//     return this.http.get<UserDetail>(`${this.apiUrl}account/detail`).pipe(
//       catchError((error) => {
//         console.error('Get user detail error', error);
//         return throwError(() => new Error('Failed to fetch user details'));
//       })
//     );
//   }

//   forgotPassword(email: string): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/forgot-password`, { email }).pipe(
//       catchError((error) => {
//         console.error('Forgot password error', error);
//         return throwError(() => new Error('Forgot password failed'));
//       })
//     );
//   }

//   resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data).pipe(
//       catchError((error) => {
//         console.error('Reset password error', error);
//         return throwError(() => new Error('Reset password failed'));
//       })
//     );
//   }

//   changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data).pipe(
//       catchError((error) => {
//         console.error('Change password error', error);
//         return throwError(() => new Error('Change password failed'));
//       })
//     );
//   }

//   getUserDetail() {
//     const token = this.getToken();
//     if (!token) return null;

//     try {
//       const decodedToken: any = jwtDecode(token);
//       const userDetail = {
//         id: decodedToken.nameid || null,
//         fullName: decodedToken.name || 'Unknown',
//         email: decodedToken.email || 'No Email',
//         roles: decodedToken.role || [],
//       };
//       return userDetail;
//     } catch (error) {
//       console.error('Error decoding token', error);
//       return null;
//     }
//   }

//   isLoggedIn(): boolean {
//     const token = this.getToken();
//     if (!token) {
//       return false; 
//     }
//     return !this.isTokenExpired();
//   }
  

//   private isTokenExpired(): boolean {
//     const token = this.getToken();
//     if (!token) return true;
//     try {
//       const decoded = jwtDecode(token);
//       // return Date.now() >= decoded['exp'] * 1000;
//       return Date.now() >= decoded['exp']! * 1000;
//     } catch (error) {
//       console.error('Error decoding token', error);
//       return true;
//     }
//   }

//   getRoles(): string[] | null {
//     const token = this.getToken();
//     if (!token) return null;
//     try {
//       const decodedToken: any = jwtDecode(token);
//       return decodedToken.role || null;
//     } catch (error) {
//       console.error('Error decoding token', error);
//       return null;
//     }
//   }

//   logout(): void {
//     localStorage.removeItem(this.userKey);
//   }

//   getAll(): Observable<UserDetail[]> {
//     return this.http.get<UserDetail[]>(`${this.apiUrl}account`).pipe(
//       catchError((error) => {
//         console.error('Get all users error', error);
//         return throwError(() => new Error('Failed to fetch users'));
//       })
//     );
//   }

//   refreshToken(data: { email: string; token: string; refreshToken: string }): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data).pipe(
//       catchError((error) => {
//         console.error('Refresh token error', error);
//         return throwError(() => new Error('Failed to refresh token'));
//       })
//     );
//   }

//   getToken(): string | null {
//     if (typeof window !== 'undefined') {
//       try {
//         const user = localStorage.getItem(this.userKey);
//         if (!user) return null;
//         const userDetail: AuthResponse = JSON.parse(user);
//         return userDetail.token;
//       } catch (error) {
//         console.error('Error parsing token from localStorage', error);
//         return null;
//       }
//     }
//     console.warn('localStorage is not available on the server side.');
//     return null;
//   }

//   getRefreshToken(): string | null {
//     if (typeof window !== 'undefined') {
//       try {
//         const user = localStorage.getItem(this.userKey);
//         if (!user) return null;
//         const userDetail: AuthResponse = JSON.parse(user);
//         return userDetail.refreshToken;
//       } catch (error) {
//         console.error('Error parsing refreshToken from localStorage', error);
//         return null;
//       }
//     }
//     console.warn('localStorage is not available on the server side.');
//     return null;
//   }

//   getCompany(): Observable<CompanyCreateRequest[]> {
//     return this.http.get<CompanyCreateRequest[]>(`${this.apiUrl}Company`).pipe(
//       catchError((error) => {
//         console.error('Get companies error', error);
//         return throwError(() => new Error('Failed to fetch companies'));
//       })
//     );
//   }

//   createCompany(data: CompanyCreateRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}company`, data).pipe(
//       catchError((error) => {
//         console.error('Create company error', error);
//         return throwError(() => new Error('Failed to create company'));
//       })
//     );
//   }
// }
