using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace OnlineRideShareApi.Models
{
    public class Customer : BaseEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; } = string.Empty;
        [Required]
        public required string CustomerPhoneNumber { get; set; }
        [EmailAddress]
        public string? CustomerEmail { get; set; }
        [Required]
        public required string CustomerNID { get; set; }
        public string? CustomerImage { get; set; }
        [Range(-90, 90)]
        public float? CustomerLatitude { get; set; }
        [Range(-180, 180)]
        public float? CustomerLongitude { get; set; }
        public string? UserId { get; set; } = string.Empty;
        //public virtual ICollection<Chat>? Chats { get; set; }
        //public virtual ICollection<Invoice>? Invoices { get; set; }
        public virtual ICollection<RideBook>? RideBooks { get; set; }
    }
}
