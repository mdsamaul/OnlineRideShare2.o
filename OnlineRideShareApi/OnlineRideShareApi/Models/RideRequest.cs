using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineRideShareApi.Models
{
    public class RideRequest
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RequestId { get; set; }
        public int? CustomerId { get; set; }
        public int? DriverId { get; set; }
        public string? SourceLocation { get; set; }
        public string? DestinationLocation { get; set; }
        public string RequestStatus { get; set; } = "Pending";
        public string? UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string? ReferredDriverId { get; set; }
        public string? ReferredCustomerName { get; set; }
        public string? ReferredCustomerPhone { get; set; }

    }

}
