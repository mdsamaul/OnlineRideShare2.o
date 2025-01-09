using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
    public class Vehicle : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VehicleId { get; set; }
        public string? UserId { get; set; } = string.Empty;
        public required string VehicleBrand { get; set; }
        public required string VehicleModel { get; set; }
        public required string VehicleCapacity { get; set; }
        public required string VehicleRegistrationNo { get; set; }
        public required string VehicleChassisNo { get; set; }
        public required string VehicleLicence { get; set; }
        public string? FitnessCertificateNo { get; set; }
        public string? InsurancePolicyNo { get; set; }
        public DateTime? FitnessExpiryDate { get; set; }
        public DateTime? InsuranceExpiryDate { get; set; }
        public DateTime? RegistrationValidityDate { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public string? FuelType { get; set; }
        public int? OdometerReading { get; set; }
        public string? VehicleColor { get; set; }
        public string? EngineNumber { get; set; }
        public string? OwnerName { get; set; }
        public int? VehicleAge { get; set; }
        public int? LastServiceMileage { get; set; }
        public string? VehicleStatus { get; set; }
        public string? VehicleColorCode { get; set; }
        public string? InsuranceProvider { get; set; }
        public int? VehicleModelYear { get; set; }
        public bool? IsAvailableForBooking { get; set; }
        [ForeignKey("VehicleType")]
        public int VehicleTypeId { get; set; }
        public virtual VehicleType? VehicleTypes { get; set; }
        //public virtual ICollection<DriverVehicle>? DriverVehicles { get; set; }
    }
}
