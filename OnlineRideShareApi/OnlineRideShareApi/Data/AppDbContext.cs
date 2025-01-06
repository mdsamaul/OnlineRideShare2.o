using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Models;

namespace OnlineRideShareApi.Data
{
    public class AppDbContext:IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {
            
        }    
        public DbSet<Company> Companies { get; set; }
        public DbSet<Driver> Drivers { get; set; }
    }
}