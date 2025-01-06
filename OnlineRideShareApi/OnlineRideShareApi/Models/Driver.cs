using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineRideShareApi.Models
{
    public class Driver :BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DriverId { get; set; }
        public string? DriverName { get; set; }
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string DrivingLicenseNo { get; set; } = string.Empty;
        [Required]
        public string DriverNid { get; set; } = string.Empty;
        public string? DriverImage { get; set; }
        [ForeignKey("Company")]
        public int? CompanyId { get; set; } = null;
        public virtual Company? Company { get; set; }
        [Range(-90, 90)]
        public float DriverLatitude { get; set; }
        [Range(-180, 180)]
        public float DriverLongitude { get; set; }
        public bool IsAvailable { get; set; }
        //public virtual ICollection<DriverVehicle>? DriverVehicles { get; set; }
    }
}
