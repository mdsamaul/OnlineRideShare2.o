namespace OnlineRideShareApi.Dtos
{
    public class InvoiceDto
    {
        public int InvoiceId { get; set; }
        public DateTime PaymentTime { get; set; }
        public decimal Amount { get; set; }
        public int DriverId { get; set; }
        public int CustomerId { get; set; }
        public string? Particular { get; set; }
    }
}
