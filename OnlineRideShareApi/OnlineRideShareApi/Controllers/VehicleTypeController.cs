using Microsoft.AspNetCore.Authorization;
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
    public class VehicleTypeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleTypeController(AppDbContext context)
        {
           _context = context;
        }
        [HttpGet]
        public async Task<IEnumerable<VehicleType>> GetVehicleType()
        {
            var vehicleType = await _context.VehicleTypes.AsNoTracking().ToListAsync();
            return vehicleType;
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<VehicleType>> VehicleType(int id)
        {
            var vehicleType = await _context.VehicleTypes.FindAsync(id);
            if (vehicleType is null)
            {
                return NotFound();
            }
            return Ok(vehicleType);
        }
        [HttpPost]
        public async Task<ActionResult> CreateVehicleType(VehicleType vehicleType)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            vehicleType.UserId = userId;
            vehicleType.SetCreateInfo();
            await _context.AddAsync(vehicleType);
            var result = await _context.SaveChangesAsync();
            if (result>0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess=true,
                    Message="Vehicle type Create Complete Successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message="Vehicle type Create field"
            });            
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditVehicleType(int id, VehicleType vehicleType)
        {
            var vehicleFormDb = await _context.VehicleTypes.FindAsync(id);
            if(vehicleFormDb is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Vehicle not found"
                });
            }
            vehicleFormDb.VehicleTypeName = vehicleType.VehicleTypeName;
            vehicleFormDb.PerKmFare = vehicleType.PerKmFare;
            vehicleFormDb.SetUpdateInfo();
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess= true,
                    Message="vehicle update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess=false,
                Message="Unabale to Vehicle"
            });
        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<VehicleType>> DeleteVehicleType(int id)
        {
            var vehicleType = await _context.VehicleTypes.FindAsync(id);
            if (vehicleType is null)
            {
                return NotFound();
            }
            _context.VehicleTypes.Remove(vehicleType);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Vehicle type delete successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "delete failed"
            });
        }
       

        [HttpGet("details")]
        public async Task<ActionResult<VehicleType>> GetVehicleTypeDetails()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (currentUserId is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User is not authenticated"
                });
            }
            var vehicleType = await _context.VehicleTypes
                                            .Where(vt => vt.UserId == currentUserId)
                                            .ToListAsync();

            if (vehicleType is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "No vehicle type found for this user"
                });
            }
            return Ok(vehicleType);          
        }

    }
}
