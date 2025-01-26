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
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {
            return await _context.Vehicles.AsNoTracking().ToListAsync();
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Vehicle>> GetByIdVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle is null)
            {
                return NotFound();
            }
            return Ok(vehicle);
        }
        [HttpPost]
        public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
        {
            var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid) {
                return BadRequest("unable to counnect");
            }
            vehicle.UserId = userid;
            vehicle.SetCreateInfo();
           await _context.Vehicles.AddAsync(vehicle);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Vehicle Create Complete Successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Vehicle Create field"
            });
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditVehicle(int id, Vehicle vehicle)
        {

            var vehicleFormDb = await _context.Vehicles.FindAsync(id);
            if (vehicleFormDb is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Vehicle not found"
                });
            }
            vehicleFormDb.VehicleBrand = vehicle.VehicleBrand;
            vehicleFormDb.VehicleImage= vehicle.VehicleImage;
            vehicleFormDb.VehicleModel = vehicle.VehicleModel;
            vehicleFormDb.VehicleCapacity = vehicle.VehicleCapacity;
            vehicleFormDb.VehicleRegistrationNo = vehicle.VehicleRegistrationNo;
            vehicleFormDb.VehicleChassisNo = vehicle.VehicleChassisNo;
            vehicleFormDb.VehicleLicence = vehicle.VehicleLicence;
            vehicleFormDb.FitnessCertificateNo = vehicle.FitnessCertificateNo;
            vehicleFormDb.FitnessExpiryDate = vehicle.FitnessExpiryDate;
            vehicleFormDb.InsuranceExpiryDate = vehicle.InsuranceExpiryDate;
            vehicleFormDb.RegistrationValidityDate = vehicle.RegistrationValidityDate;
            vehicleFormDb.LastMaintenanceDate = vehicle.LastMaintenanceDate;
            vehicleFormDb.FuelType = vehicle.FuelType;
            vehicleFormDb.OdometerReading= vehicle.OdometerReading;
            vehicleFormDb.VehicleColor = vehicle.VehicleColor;
            vehicleFormDb.EngineNumber = vehicle.EngineNumber;
            vehicleFormDb.OwnerName = vehicle.OwnerName;
            vehicleFormDb.VehicleAge = vehicle.VehicleAge;
            vehicleFormDb.LastServiceMileage = vehicle.LastServiceMileage;
            vehicleFormDb.VehicleStatus = vehicle.VehicleStatus;
            vehicleFormDb.VehicleColorCode = vehicle.VehicleColorCode;
            vehicleFormDb.InsuranceProvider = vehicle.InsuranceProvider;
            vehicleFormDb.VehicleModelYear = vehicle.VehicleModelYear;
            vehicleFormDb.IsAvailableForBooking = vehicle.IsAvailableForBooking;
            vehicleFormDb.VehicleTypeId = vehicle.VehicleTypeId;
            vehicleFormDb.SetUpdateInfo();
            var result = await _context.SaveChangesAsync();
            if (result>0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "vehicle update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unabale to Vehicle"
            });
        }
        
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Vehicle>> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle is null)
            {
                return NotFound();
            }
           _context.Vehicles.Remove(vehicle);
            var result = await _context.SaveChangesAsync(); 
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Vehicle delete successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "delete failed"
            });
        }
        [HttpGet("details")]
        public async Task<ActionResult<Vehicle>> GetVehicleDetails()
        {
            var currentUser = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUser is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User is not authenticated"
                });
            }
            var vehicle = await _context.Vehicles.Where(v => v.UserId == currentUser).ToListAsync();
            if (vehicle is null) {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "No vehicle type found for this user"
                });
            }
            return Ok(vehicle);
        }
    }
}
