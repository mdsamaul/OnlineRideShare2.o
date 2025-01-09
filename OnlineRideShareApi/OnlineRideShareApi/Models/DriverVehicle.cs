using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
    public class DriverVehicle : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DriverVehicleId { get; set; }
        public string? UserId { get; set; } = string.Empty;
        [ForeignKey("Driver")]
        public int DriverId { get; set; }
        public virtual Driver? Driver { get; set; }
        [ForeignKey("Vehicle")]
        public int VehicleId { get; set; }
        public virtual Vehicle? Vehicle { get; set; }
        //public virtual ICollection<RideBook>? RideBooks { get; set; }
    }
}
