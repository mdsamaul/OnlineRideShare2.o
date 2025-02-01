namespace OnlineRideShareApi.Dtos
{
    using OnlineRideShareApi.Models;
    using System;
    using System.ComponentModel.DataAnnotations.Schema;

    public class RideBookDto
    {
        public int RideBookId { get; set; }
        public int? CustomerId { get; set; }
        public int? DriverVehicleId { get; set; }
        public string? ReferenceName { get; set; }
        public string? ReferencePhoneNumber { get; set; }
        public string SourceLocation { get; set; } = string.Empty;
        public string DestinationLocation { get; set; } = string.Empty;
        public float? SourceLatitude { get; set; }
        public float? SourceLongitude { get; set; }
        public float? DestinationLatitude { get; set; }
        public float? DestinationLongitude { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal? TotalFare { get; set; }
        public bool? IsPaid { get; set; }
        public int? DriverRating { get; set; }
        public int? CustomerRating { get; set; }
        public float? DistanceInMeters { get; set; }
        public string? UserId { get; set; } = string.Empty;
    }
}
