export interface RideBook {
  rideBookId: number;
  customerId: number| undefined;
  driverVehicleId: number | null;  // Make it optional
  referenceName: string | null;
  referencePhoneNumber: string | null;
  sourceLocation: string;
  destinationLocation: string;
  startTime: string;
  endTime: string;
  totalFare: number;
  isPaid: boolean;
  driverRating: number | null;
  customerRating: number | null;
  distanceInMeters: number;
}
