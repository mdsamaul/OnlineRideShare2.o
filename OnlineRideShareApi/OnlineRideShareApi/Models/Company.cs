using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineRideShareApi.Models
{
    public class Company : BaseEntity
    {
        [Required]
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Address { get; set; }
        [EmailAddress]
        public string CompanyEmail { get; set;} = string.Empty;
        public required string CompanyPhoneNumber { get; set; }
        //public virtual ICollection<Bank>? Banks { get; set; }
        //public virtual ICollection<Driver>? Drivers { get; set; }

    }
}
