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
        public virtual Customer? Customers { get; set; }
        [ForeignKey("DriverVehicle")]
        public int? DriverVehicleId { get; set; }
        public virtual DriverVehicle? DriverVehicles { get; set; }
        public string? ReferenceName { get; set; }
        public string? ReferencePhoneNumber { get; set; }
        public float? SourceLatitude { get; set; }
        public float? SourceLongitude { get; set; }
        public float? DestinationLatitude { get; set; }
        public float? DestinationLongitude { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal TotalFare { get; set; }
        public bool IsPaid { get; set; }
        public decimal? DriverRating { get; set; }
        public decimal? CustomerRating { get; set; }
        public float DistanceInMeters { get; set; }
        public string? UserId { get; set; } = string.Empty;

        public virtual ICollection<RideTrack>? RideTracks { get; set; }
    }
}
