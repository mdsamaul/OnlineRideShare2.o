export interface DriverCreateRequest{
   driverId: number;
  driverName: string;
  phoneNumber: string;
  userId: string;
  email: string;
  drivingLicenseNo: string;
  driverNid: string;
  driverImage: string;
  companyId: number | null;
  company: string | null;
  driverLatitude: number;
  driverLongitude: number;
  isAvailable: boolean;
  driverVehicles: any | null; 
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  isActive: boolean;
}