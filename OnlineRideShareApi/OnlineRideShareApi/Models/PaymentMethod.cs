using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
    public class PaymentMethod : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentMethodId { get; set; }
        public string? MethodType { get; set; }
        public string? UserId { get; set; } = string.Empty;
        public virtual ICollection<Invoice>? Invoices { get; set; }
    }
}
