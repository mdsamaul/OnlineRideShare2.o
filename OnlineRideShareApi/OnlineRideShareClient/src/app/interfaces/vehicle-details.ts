export interface VehicleDetails {
    vehicleId: number;
    userId?: string;
    vehicleImage?:string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleCapacity: string;
    vehicleRegistrationNo: string;
    vehicleChassisNo: string;
    vehicleLicence: string;
    fitnessCertificateNo?: string;
    insurancePolicyNo?: string;
    fitnessExpiryDate?: Date;
    insuranceExpiryDate?: Date;
    registrationValidityDate?: Date;
    lastMaintenanceDate?: Date;
    fuelType?: string;
    odometerReading?: number;
    vehicleColor?: string;
    engineNumber?: string;
    ownerName?: string;
    vehicleAge?: number;
    lastServiceMileage?: number;
    vehicleStatus?: string;
    vehicleColorCode?: string;
    insuranceProvider?: string;
    vehicleModelYear?: number;
    isAvailableForBooking?: boolean;
    vehicleTypeId: number;
  }
  