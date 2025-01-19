using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineRideShareApi.Models
{
    public class RideTrack
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RideTrackId { get; set; }
        [ForeignKey("RideBook")]
        public int RideBookId { get; set; }
        public virtual RideBook? RideBooks { get; set; }
        public float RideTrackLatitude { get; set; }
        public float RideTrackLongitude { get; set; }
        public DateTime Timestamp { get; set; }
        public int Distance { get; set; }
    }

}
