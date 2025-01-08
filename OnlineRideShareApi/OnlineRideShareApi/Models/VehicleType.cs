using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
  
    public class VehicleType : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VehicleTypeId { get; set; }
        public string? VehicleTypeName { get; set; }
        public string? UserId { get; set; }
        public decimal PerKmFare { get; set; }
        //public virtual ICollection<FareDetail>? FareDetails { get; set; }
        //public virtual ICollection<Vehicle>? Vehicles { get; set; }
    }
}
