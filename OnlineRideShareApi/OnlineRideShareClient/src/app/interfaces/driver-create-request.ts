export interface DriverCreateRequest{
  driverId:number;
  driverName: string;
  phoneNumber: string;
  email: string;
  drivingLicenseNo: string;
  driverNid: string;
  driverImage: string;
  companyId: number;
  company: any; 
  driverLatitude: number;
  driverLongitude: number;
  isAvailable: boolean;
  userId:string;
}