export interface AddPaymentInvoiceRequestDto {
    // Payment-related properties
    PaymentId?:number;
    paymentAmount: number;
    paymentUserId?: string;
    paymentDate?: Date;
    paymentStatus?: string;
    invoiceId?: number;
  
    // Invoice-related properties
    paymentTime: Date;
    invoiceAmount: number;
    invoiceUserId?: string;
    driverId: number;
    customerId: number;
    paymentMethodId: number;
    particular?: string;
  }
  