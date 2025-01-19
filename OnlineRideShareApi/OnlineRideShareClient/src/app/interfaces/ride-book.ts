export interface RideBook {
  rideBookId: number;
  customerId?: number; 
  driverVehicleId?: number;
  referenceName?: string;
  referencePhoneNumber?: string;
  sourceLocation: string;
  destinationLocation?: string;
  startTime: string; 
  endTime: string; 
  totalFare: number;
  isPaid: boolean;
  driverRating?: number;
  customerRating?: number; 
  distanceInMeters: number;
  userId?: string;
}

