using Microsoft.AspNetCore.Identity;

namespace OnlineRideShareApi.Models
{
    public class AppUser:IdentityUser
    {
        public string? FullName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefrieshTokenExpiryTime { get; set; }
    }
}