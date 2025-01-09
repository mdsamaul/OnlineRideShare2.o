using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using System.Security.Claims;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriverController(AppDbContext context)
        {
            _context = context;
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
                //return Ok(new AuthResponseDto
                //{
                //    IsSuccess = true,
                //    Message = "Account Created Sucessfully!"
                //});
                //return Ok("Companey Create successfully");
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
    }
}
