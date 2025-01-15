export interface AuthResponse {
  token: string;
  isSuccess: true;  
  message: string;
  refreshToken:string;
  status:string;
  requestId:number;
  requestStatus:string;
}
