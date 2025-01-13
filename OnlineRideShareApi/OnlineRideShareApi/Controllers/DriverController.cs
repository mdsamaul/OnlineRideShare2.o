using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using OnlineRideShareApi.Service;
using System.Security.Claims;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly GeoCodingService _geoCodingService;

        public DriverController(AppDbContext context, GeoCodingService geoCodingService)
        {
            _context = context;
            _geoCodingService = geoCodingService;
        }
        [HttpGet]
        public async Task<IEnumerable<Driver>> GetDrivers()
        {
            var drivers = await _context.Drivers.AsNoTracking().ToListAsync();
            return drivers;
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Driver>> GetDriverById(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);  
            if(driver is null){
                return NotFound();
            }
            return Ok(driver);
        }
        [HttpPut("{id:int}")]
        public async Task<ActionResult> updateDriver(int id, Driver driver)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var driverFromDb = await _context.Drivers.FindAsync(id);
            if (driverFromDb is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Driver Not found"
                });
            }
            driverFromDb.DriverName = driver.DriverName;
            driverFromDb.PhoneNumber = driver.PhoneNumber;
            driverFromDb.Email = driver.Email;
            driverFromDb.DrivingLicenseNo = driver.DrivingLicenseNo;
            driverFromDb.DriverNid = driver.DriverNid;
            driverFromDb.DriverImage = driver.DriverImage;
            driverFromDb.CompanyId = driver.CompanyId;
            driverFromDb.DriverLatitude = driver.DriverLatitude;
            driverFromDb.DriverLongitude = driver.DriverLongitude;
            driverFromDb.IsAvailable = driver.IsAvailable;
            driverFromDb.SetUpdateInfo();
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Driver Edit Successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message="Unable to Driver"
            });
        }

        [HttpPost]
        public async Task<ActionResult> CreateDriver(Driver driver)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            driver.UserId = currentUserId;
            driver.SetCreateInfo();
            await _context.AddAsync(driver);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {               
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Driver create Success.",
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Driver Create field"
            });
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Driver>> DeleteDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if(driver is null)
            {
                return NotFound();
            }

            _context.Drivers.Remove(driver);
            var result = await _context.SaveChangesAsync();
            if(result> 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Driver Deleted Successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unable to deleted Driver"
            });
        }
        [HttpGet("details")]
        public async Task<ActionResult<Driver>> DriverDetails()
        {
            var currentDriverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(currentDriverId is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message="User not autherticate"
                });
            }
            var driver =await _context.Drivers.Where(dr => dr.UserId == currentDriverId).ToListAsync();
            if (driver is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "driver not found"
                });
            }
            return Ok(driver);
        }
        // PATCH: api/Driver/5/SetStatus
        [HttpPatch("{id:int}/SetStatus")]
        public async Task<ActionResult> SetDriverStatus(int id, [FromQuery] bool isAvailable)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return NotFound();

            driver.IsAvailable = isAvailable;
            driver.SetUpdateInfo();
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Driver status updated to {(isAvailable ? "Online" : "Offline")}.",
                driver
            });
        }
       
        [HttpGet("nearbyDrivers")]
        public async Task<ActionResult> GetNearbyDrivers([FromQuery] string customerLocation)
        {
            try
            {
                var (customerLat, customerLon) = await _geoCodingService.GetCoordinatesFromAddressAsync(customerLocation);
                   var drivers = await _context.Drivers
                    .Where(driver => driver.IsAvailable == true)  
                    .ToListAsync();
                var nearbyDrivers = drivers.Select(driver =>
                {
                    var distance = CalculateDistance(customerLat, customerLon, driver.DriverLatitude, driver.DriverLongitude);
                    return new { driver, distance }; 
                })
                .Where(driverWithDistance => driverWithDistance.distance <= 5)
                .OrderBy(driverWithDistance => driverWithDistance.distance) 
                .Select(driverWithDistance => driverWithDistance.driver) 
                .ToList();

                return Ok(nearbyDrivers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Error: " + ex.Message });
            }
        }
        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double EarthRadius = 6371;
            var dLat = DegreesToRadians(lat2 - lat1);
            var dLon = DegreesToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return EarthRadius * c; 
        }
        private double DegreesToRadians(double degrees)
        {
            return degrees * (Math.PI / 180);
        }

        [HttpPost("update-location")]
        public async Task<IActionResult> UpdateDriverLocation([FromBody] LocationDto locationDto)
        {
            var DriverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var driver = await _context.Drivers.FirstAsync(c => c.UserId == DriverId);
            if (driver is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "driver not found"
                });
            }
            driver.DriverLatitude = locationDto.Latitude;
            driver.DriverLongitude = locationDto.Longitude;
            driver.SetUpdateInfo();
            _context.Drivers.Update(driver);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Location updated successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Failed to update location"
            });
        }

    }
}

