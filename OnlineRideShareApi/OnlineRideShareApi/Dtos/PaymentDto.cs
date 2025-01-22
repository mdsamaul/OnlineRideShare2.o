namespace OnlineRideShareApi.Dtos
{
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int? InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? Status { get; set; }
        public InvoiceDto? Invoice { get; set; }
    }
}
