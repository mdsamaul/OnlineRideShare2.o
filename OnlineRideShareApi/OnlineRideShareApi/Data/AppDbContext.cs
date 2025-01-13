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
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<Driver> Drivers { get; set; }
        public virtual DbSet<VehicleType> VehicleTypes { get; set; }
        public virtual DbSet<Vehicle> Vehicles { get; set; }
        public virtual DbSet<DriverVehicle> DriverVehicles { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<RideBook> RideBooks { get; set; }
        public virtual DbSet<RideRequest> RideRequests { get; set; }
    }
}