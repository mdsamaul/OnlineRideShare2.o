using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverVehiclesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriverVehiclesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IEnumerable<DriverVehicle>> GetDriverVehicles()
        {
            return await _context.DriverVehicles.AsNoTracking().ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult> PostDriverVehicle(DriverVehicle driverVehicle)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            driverVehicle.UserId = currentUserId;
            driverVehicle.SetCreateInfo();
            await _context.DriverVehicles.AddAsync(driverVehicle);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Driver Vehicle create Success.",
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Driver vehicle Create field"
            });
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<DriverVehicle>> GetDriverVehicle(int id)
        {
            var driverVehicle = await _context.DriverVehicles.FindAsync(id);
            if (driverVehicle == null)
            {
                return NotFound();
            }
            return Ok(driverVehicle);
        }
        [HttpPut("{id:int}")]
        public async Task<ActionResult> EditDriverVehicle(int id, DriverVehicle driverVehicle)
        {

            
            var exDriverVehicle = await _context.DriverVehicles.FindAsync(id);
            if (exDriverVehicle is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Driver Vehicle not found"
                });
            }
            exDriverVehicle.DriverId = driverVehicle.DriverId;
            exDriverVehicle.VehicleId = driverVehicle.VehicleId;
            exDriverVehicle.SetUpdateInfo();

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Driver Vehicle Update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unable to Driver vehicle"
            });
        }
       
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<DriverVehicle>> DeleteDriverVehicle(int id)
        {
            var driverVehicle = await _context.DriverVehicles.FindAsync(id);
            if (driverVehicle == null)
            {
                return NotFound();
            }
            _context.DriverVehicles.Remove(driverVehicle);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Driver vehicle deleted successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unable to delete Drver vehicle"
            });
        }
        [HttpGet("details")]
        public async Task<ActionResult<DriverVehicle>> DriverVehicleDetails()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "uaser not auththenticate"
                });
            }
            var driverVehicle =  _context.DriverVehicles.Where(dv => dv.UserId == currentUserId).ToList();
            if (driverVehicle is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "no Driver Vehicle found this user"
                });
            }
            return Ok(driverVehicle);
        }
    }
}
