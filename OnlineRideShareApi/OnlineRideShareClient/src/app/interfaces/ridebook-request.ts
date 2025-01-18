export interface RideBookRequest{    
    requestId: number;
    customerId?: number;
    driverId?: number;
    sourceLocation?: string;
    destinationLocation?: string;
    requestStatus: string;
    userId?: string;
    createdAt: Date;
    updatedAt?: Date;
    referredDriverId?: string;
    referredCustomerName?: string;
    referredCustomerPhone?: string;
}