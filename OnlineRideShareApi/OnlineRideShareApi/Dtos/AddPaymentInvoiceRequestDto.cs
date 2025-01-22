namespace OnlineRideShareApi.Dtos
{
    public class AddPaymentInvoiceRequestDto
    {
        // Payment-related properties
        public int PaymentId { get; set; }
        public decimal PaymentAmount { get; set; }
        public string? PaymentUserId { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public string? PaymentStatus { get; set; } = "Pending";
        public int? InvoiceId { get; set; }

        // Invoice-related properties
        public DateTime PaymentTime { get; set; }
        public decimal InvoiceAmount { get; set; }
        public string? InvoiceUserId { get; set; }
        public int DriverId { get; set; }
        public int CustomerId { get; set; }
        public int PaymentMethodId { get; set; }
        public string? Particular { get; set; }
    }
}
