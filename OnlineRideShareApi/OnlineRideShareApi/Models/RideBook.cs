using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
    public class RideBook : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RideBookId { get; set; }
        [ForeignKey("Customer")]
        public int CustomerId { get; set; }
        //public virtual Customer? Customers { get; set; }
        [ForeignKey("DriverVehicle")]
        public int DriverVehicleId { get; set; }
        public virtual DriverVehicle? DriverVehicles { get; set; }
        public string? ReferenceName { get; set; }
        public string? ReferencePhoneNumber { get; set; }
        public string SourceLocation { get; set; } = string.Empty;
        public string DestinationLocation { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal TotalFare { get; set; }
        public bool IsPaid { get; set; }
        public string? DriverRating { get; set; }
        public string? CustomerRating { get; set; }
        public float DistanceInMeters { get; set; }
        public string? UserId { get; set; } = string.Empty;

        //public virtual ICollection<RideTrack>? RideTracks { get; set; }
    }
}
