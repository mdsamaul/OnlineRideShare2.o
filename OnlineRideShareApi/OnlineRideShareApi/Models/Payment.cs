using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
    public class Payment : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; }
        [ForeignKey("Invoice")]
        public int? InvoiceId { get; set; }
        public virtual Invoice? Invoice { get; set; }
        public decimal Amount { get; set; }
        public string? UserId { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public string? Status { get; set; }        
    }
}
