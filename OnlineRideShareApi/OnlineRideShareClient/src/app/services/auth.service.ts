import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { createRequest } from '../interfaces/create-request';
import { RideBook } from '../interfaces/ride-book';
import { ReferCustomer } from '../interfaces/ReferCustomer';
import { RideBookRequest } from '../interfaces/ridebook-request';
import { RideTrack } from '../interfaces/RideTrack';
import { AddPaymentInvoiceRequestDto } from '../interfaces/AddPaymentInvoiceRequest';
interface ImgBBResponse {
  data: {
    url: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  private uploadUrl = 'https://localhost:7111/api/Image/upload';
  constructor(private http: HttpClient) {}
  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image, image.name); 

    const headers = new HttpHeaders();

    return this.http.post(this.uploadUrl, formData, { headers });
  }
  login(data: LoginRequest): Observable<AuthResponse | null> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        catchError((error) => {
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
    return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data);
  }

  getDetail(): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.apiUrl}account/detail`).pipe(
      catchError((error) => {
        console.error('Fetching user details failed', error);
        throw error;
      })
    );
  }
  getAll = (): Observable<UserDetail[]> =>
    this.http.get<UserDetail[]>(`${this.apiUrl}account`);

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}account/forgot-password`,
      { email }
    );
    // .pipe(catchError(error => {
    //   console.error('Forgot password request failed', error);
    //   return of({ isSuccess: false, message: 'Forgot password request failed' } as AuthResponse);
    // }));
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}account/reset-password`,
      data
    );
    // .pipe(catchError(error => {
    //   console.error('Reset password failed', error);
    //   return of({ isSuccess: false, message: 'Reset password failed' } as AuthResponse);
    // }));
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}account/change-password`,
      data
    );
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

  refreshToken(data: {
    email: string;
    token: string;
    refreshToken: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}account/refresh-token`,
      data
    );
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
    return this.http.get<CompanyCreateRequest[]>(`${this.apiUrl}company`).pipe(
      catchError((error) => {
        console.error('Fetching companies failed', error);
        return of([]);
      })
    );
  }
  //company details
  detailsCompany(): Observable<CompanyCreateRequest[]> {
    return this.http.get<CompanyCreateRequest[]>(
      `${this.apiUrl}company/details`
    );
  }

  // getVehicleTypeDetails(): Observable<VehicleType[]> {
  //   return this.http.get<VehicleType[]>(`${this.apiUrl}vehicletype/details`);
  // }
  createCompany(data: CompanyCreateRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}company`, data);
    // .pipe(catchError(error => {
    //   console.error('Creating company failed', error);
    //   return of({ isSuccess: false, message: 'Creating company failed' } as AuthResponse);
    // }));
  }

  getCompanyById(id: number): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}company/${id}`).pipe(
      catchError((error) => {
        console.error('Fetching company by ID failed', error);
        throw error;
      })
    );
  }

  editCompany(
    id: number,
    data: CompanyCreateRequest
  ): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}company/${id}`, data);
    // .pipe(catchError(error => {
    //   console.error('Editing company failed', error);
    //   return of({ isSuccess: false, message: 'Editing company failed' } as AuthResponse);
    // }));
  }

  deleteCompany(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}company/${id}`);
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
  detailsDriver(): Observable<DriverCreateRequest[]> {
    return this.http.get<DriverCreateRequest[]>(`${this.apiUrl}driver/details`);
  }
  createDriver(data: DriverCreateRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}driver`, data);
  }

  getDriverById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}driver/${id}`);
  }

  deleteDriver(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}driver/${id}`);
  }

  driverEdit(id: number, data: DriverCreateRequest): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}driver/${id}`, data);
  }

  //driver status online or offline

  setDriverStatus(id: number, isAvailable: boolean): Observable<AuthResponse> {
    const url = `${this.apiUrl}driver/${id}/SetStatus`;
    return this.http.patch<AuthResponse>(url, null, {
      params: { isAvailable: isAvailable },
    });
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

  getVehicleTypeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}vehicletype/${id}`);
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
  getAllVehicle(): Observable<VehicleDetails[]> {
    return this.http.get<VehicleDetails[]>(`${this.apiUrl}Vehicle`);
  }
  //post vehicle
  createVehicle(data: VehicleDetails): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Vehicle`, data);
  }

  //edit vehicel
  editVehicle(id: number, data: VehicleDetails): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}Vehicle/${id}`, data);
  }

  //get by id

  getByIdVehicle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Vehicle/${id}`);
  }
  //delete vehicle
  deleteVehicle(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}Vehicle/${id}`);
  }

  //get details vehicle
  getVehicleDetails(): Observable<VehicleDetails[]> {
    return this.http.get<VehicleDetails[]>(`${this.apiUrl}Vehicle/details`);
  }

  //driver vehicle
  getAllDriverVehicle(): Observable<DriverVehicle[]> {
    return this.http.get<DriverVehicle[]>(`${this.apiUrl}DriverVehicles`);
  }

  //driver vehicle post
  createDriverVehicle(data: DriverVehicle): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}DriverVehicles`, data);
  }

  //driver vehicle id
  getDriverVehicleId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}DriverVehicles/${id}`);
  }

  //edit driver vehicle
  editDriverVehicle(id: number, data: DriverVehicle): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(
      `${this.apiUrl}DriverVehicles/${id}`,
      data
    );
  }

  //delete driver vehcile
  deleteDriverVehicle(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}DriverVehicles/${id}`);
  }
  //details driver vehicle
  detailsDriverVehicle(): Observable<DriverVehicle[]> {
    return this.http.get<DriverVehicle[]>(
      `${this.apiUrl}DriverVehicles/details`
    );
  }
//RideBook/getAllRidebookRequest
getAllRidebookRequest():Observable<any>{
  return this.http.get<any>(`${this.apiUrl}RideBook/getAllRidebookRequest`)
}


  //customer

  getAllCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}Cusomer`);
  }
  //get specif user
  detaislCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}Cusomer/details`);
  }

  //create customer
  createCustomer(data: Customer): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Cusomer`, data);
  }

  //edit customer
  editCustomer(id: number, data: Customer): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}Cusomer/${id}`, data);
  }
  //get by id customer
  getIdByCustomer(id: number): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}Cusomer/${id}`);
  }

  //delete
  deleteCustomer(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}Cusomer/${id}`);
  }
  //customer er current location
  sendLocationToApi(
    latitude: number,
    longitude: number
  ): Observable<AuthResponse> {
    const url = `${this.apiUrl}Cusomer/update-location`;
    return this.http.post<AuthResponse>(url, {
      latitude: latitude,
      longitude: longitude,
    });
  }

  ///ride share search

  nearbyDriverSearchSourceCustomerLocation(
    sourceLocation: string,
    destinationLocation: string
  ): Observable<AuthResponse[]> {
    return this.http.get<AuthResponse[]>(
      `${this.apiUrl}RideBook/nearbyDrivers?sourceLocation=${encodeURIComponent(
        sourceLocation
      )}&destinationLocation=${encodeURIComponent(destinationLocation)}`
    );
  }
  ///RideBook/createRequest
  createRequest(data: createRequest): Observable<RideBookRequest> {
    return this.http.post<RideBookRequest>(
      `${this.apiUrl}RideBook/createRequest`,
      data
    );
  }

  //get ridebook for driver
  getRidebookId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}RideBook/${id}`);
  }
  //accecpt or cancle request from driver
  // getDriverResponse(id:number,status:string):Observable<AuthResponse>{
  //   return this.http.post<AuthResponse>(`${this.apiUrl}RideBook/manageRequest/${id}`, status)
  // }

  //getRequestRidebook
  getRequest(id: number): Observable<RideBookRequest> {
    return this.http.get<RideBookRequest>(
      `${this.apiUrl}RideBook/getRequest/${id}`
    );
  }

  getDriverResponse(id: number, status: string): Observable<AuthResponse> {
    const headers = { 'Content-Type': 'application/json' }; // Ensure Content-Type is JSON
    const body = JSON.stringify(status); // Convert status to JSON string
    return this.http.post<AuthResponse>(
      `${this.apiUrl}RideBook/manageRequest/${id}`,
      body,
      { headers }
    );
  }

  //cancle ridebook request
  cancelRidebookRequest(
    id: number,
    requestId: number
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}RideBook/cancelRequest/${id}`,
      requestId
    );
  }

  //get RideBook/ForDriver
  getRidebookForDriver(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}RideBook/ForDriver`);
  }
  //accept RideBook/acceptRequest/2031
  // Accept RideBook Request
  acceptRideBookRequest(id: number, requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}RideBook/acceptRequest/${id}`, {
      requestId,
    });
  }

  // Cancel RideBook Request
  cancelRideBookRequest(id: number, requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}RideBook/cancelRequest/${id}`, {
      requestId,
    });
  }
  ///RideBook/getDriverContact/2038
  getDriverContact(requestId: number): Observable<DriverCreateRequest> {
    return this.http.get<DriverCreateRequest>(
      `${this.apiUrl}RideBook/getDriverContact/${requestId}`
    );
  }
  //confirm request form RideBook/confirmRequest/12

  customerConfirmRequest(id: number, requestId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}RideBook/confirmRequest/${id}`,
      requestId
    );
  }

  //get all ride book
  getAllRidebook(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}RideBook`);
  }
  //ridebook
  createRidebook(data: RideBook): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}RideBook`, data);
  }

  ///RideBook/confirmPickup/23' \
  confirmPickup(id: number, requestId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}RideBook/confirmPickup/${id}`,
      requestId
    );
  }

  //RideBook/referCustomer/2065
  referCustomer(id: number, data: ReferCustomer): Observable<ReferCustomer> {
    return this.http.post<ReferCustomer>(
      `${this.apiUrl}RideBook/referCustomer/${id}`,
      data
    );
  }

  // RideBook
  createRideBook(data: RideBook): Observable<RideBook> {
    return this.http.post<RideBook>(`${this.apiUrl}RideBook`, data);
  }

  //ride track

  getRideTracks(rideBookId: number): Observable<RideTrack[]> {
    return this.http.get<RideTrack[]>(`${this.apiUrl}RideTrack/${rideBookId}`);
  }

  //create track
  createRideTrack(data: RideTrack): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}RideTrack`, data);
  }

  //all invoice
  getAllInvoice(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Invoice`);
  }

  //invoice get by id
  invoiceGetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Invoice/${id}`);
  }
  //get all Payment
  getAllPayment(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Payment`);
  }
  //payment-details/1241'

  getPaymentDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Payment/payment-details`);
  }

  //get all payment method
  getAllPaymentMethod(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}PaymentMethod`);
  }
  //PaymentMethod get by id
  getByIdPaymentMethod(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}PaymentMethod/${id}`);
  }

  //Payment/add-payment-invoice
  createPaymentInvoice(
    data: AddPaymentInvoiceRequestDto
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}Payment/add-payment-invoice`,
      data
    );
  }
}
