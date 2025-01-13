using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using OnlineRideShareApi.Service;
using System.Security.Claims;
using System.Text.Json;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RideBookController : ControllerBase
    {
        //private static double distance;
        private readonly AppDbContext _context;
        private readonly GeoCodingService _geoCodingService;

        public RideBookController(AppDbContext context, GeoCodingService geoCodingService)
        {
            _context = context;
            _geoCodingService = geoCodingService;
        }
        [HttpGet]
        public async Task<IEnumerable<RideBook>> getRideBook()
        {
            return await _context.RideBooks.AsNoTracking().ToListAsync();
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<RideBook>> getByIdRidebook(int id)
        {
            var ridebookFormDb = await _context.RideBooks.FindAsync(id);
            if (ridebookFormDb is null)
            {
                return NotFound();
            }
            return Ok(ridebookFormDb);
        }
        [HttpPost]
        public async Task<ActionResult> CreateRidebook(RideBook rideBook)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            rideBook.UserId = userId;
            rideBook.SetCreateInfo();
            await _context.RideBooks.AddAsync(rideBook);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Ride book create Success.",
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "ridebook Create field"
            });
        }

        [HttpGet("nearbyDrivers")]
        public async Task<ActionResult> GetNearbyDrivers([FromQuery] string sourceLocation, string destinationLocation)
        {
            try
            {
                var (sourceLat, sourceLon) = await _geoCodingService.GetCoordinatesFromAddressAsync(sourceLocation);
                var (destinationLat, destinationLon) = await _geoCodingService.GetCoordinatesFromAddressAsync(destinationLocation);

                var drivers = await _context.Drivers
                    .Where(driver => driver.IsAvailable)
                    .ToListAsync();
                var distance = CalculateDistance(sourceLat, sourceLon, destinationLat, destinationLon);
                var nearbyDrivers = drivers
                    .Select(driver =>
                    {
                        var distanceDriver = CalculateDistance(sourceLat, sourceLon, driver.DriverLatitude, driver.DriverLongitude);
                        return new { Driver = driver, Distance = distanceDriver };
                    })
                    .Where(driverWithDistance => driverWithDistance.Distance <= 5)
                    .OrderBy(driverWithDistance => driverWithDistance.Distance)
                    .ToList();

                var nearbyDriverIds = nearbyDrivers.Select(d => d.Driver.DriverId).ToList();

                var driverVehicleDetails = await (from v in _context.Vehicles
                                                  join dv in _context.DriverVehicles on v.VehicleId equals dv.VehicleId
                                                  where nearbyDriverIds.Contains(dv.DriverId)
                                                  select new { Vehicle = v, dv.DriverId }).Distinct().ToListAsync();

                var vehicleFareDetails = (from dv in driverVehicleDetails
                                          join vt in _context.VehicleTypes on dv.Vehicle.VehicleTypeId equals vt.VehicleTypeId
                                          select new
                                          {
                                              dv.DriverId,
                                              dv.Vehicle.VehicleId,
                                              PerKmFare = vt.PerKmFare
                                          }).ToList();

                var vehicleFareArray = nearbyDrivers.Select(driverWithDistance =>
                {
                    var driverId = driverWithDistance.Driver.DriverId;
                    var vehicleDetail = vehicleFareDetails.FirstOrDefault(vf => vf.DriverId == driverId);

                    var perKmFare = vehicleDetail?.PerKmFare ?? 0;
                    var totalFare = (double)perKmFare * distance;

                    return new
                    {
                        DriverId = driverId,
                        VehicleId = vehicleDetail?.VehicleId,
                        Distance = driverWithDistance.Distance,
                        FarePerKm = totalFare + 50
                    };
                }).ToList();

                return Ok(vehicleFareArray);
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
       
        [HttpPost("createRequest")]
        public async Task<ActionResult> CreateRideRequest([FromBody] RideRequestDto rideRequestDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            if (rideRequestDto.DriverId == null)
                return BadRequest(new { Message = "DriverId is required to create a ride request." });
            var user = await _context.Users.FindAsync(userId);
           
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
            if (customer == null)
                return NotFound(new { Message = "Customer not found." });
            var selectedDriver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.DriverId == rideRequestDto.DriverId && d.IsAvailable);
            if (selectedDriver == null)
                return BadRequest(new { Message = "Selected driver is not available." });

            var newRequest = new RideRequest
            {
                UserId = userId,
                CustomerId = customer.CustomerId,
                DriverId = rideRequestDto.DriverId,
                SourceLocation = rideRequestDto.SourceLocation,
                DestinationLocation = rideRequestDto.DestinationLocation,
                RequestStatus = "Pending"
            };

            await _context.RideRequests.AddAsync(newRequest);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return Ok(new { Message = "Ride request created successfully.", RequestId = newRequest.RequestId });
            }
            return BadRequest(new { Message = "Failed to create ride request." });
        }



        //get request from a customer 
        [HttpGet("getRequest/{requestId}")]
        public async Task<ActionResult> GetRideRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });
            var requestDriver = await _context.RideRequests.FindAsync(requestId);
            var driver = _context.Drivers.Find(requestDriver.DriverId);

            var rideRequest = await _context.RideRequests
                .FirstOrDefaultAsync(r => r.RequestId == requestId && r.DriverId == driver.DriverId);
            var d = rideRequest;
            if (rideRequest == null)
                return NotFound(new { Message = "Request not found or you are not authorized to view this request." });

            return Ok(rideRequest);
        }

        //accep driver speecific
        [HttpPost("acceptRequest/{requestId}")]
        public async Task<ActionResult> AcceptRideRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            if (rideRequest == null)
                return NotFound(new { Message = "Request not found." });

            var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return Unauthorized(new { Message = "You are not authorized to accept this request." });

            if (rideRequest.DriverId != driver.DriverId)
                return Unauthorized(new { Message = "You are not authorized to accept this request." });

            if (rideRequest.RequestStatus != "Pending")
                return BadRequest(new { Message = "This request has already been processed." });

            rideRequest.RequestStatus = "Accepted";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Request accepted successfully." });
        }

        //cancle request
        [HttpPost("cancelRequest/{requestId}")]
        public async Task<ActionResult> CancelRideRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            if (rideRequest == null)
                return NotFound(new { Message = "Request not found." });
          
            var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == userId);
            if (driver == null)
                return Unauthorized(new { Message = "You are not authorized to accept this request." });
          
            if (rideRequest.DriverId != driver.DriverId)
                return Unauthorized(new { Message = "You are not authorized to cancel this request." });

            if (rideRequest.RequestStatus != "Pending")
                return BadRequest(new { Message = "This request has already been processed." });

            rideRequest.RequestStatus = "Cancelled";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Request cancelled successfully." });
        }

        //get driver info 
        [HttpGet("getDriverContact/{requestId}")]
        public async Task<ActionResult> GetDriverContact(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            if (rideRequest == null || rideRequest.RequestStatus != "Accepted")
                return NotFound(new { Message = "Driver contact is not available for this request." });

            if (rideRequest.UserId != userId)
                return Unauthorized(new { Message = "You are not authorized to view this driver contact." });

            var driver = await _context.Drivers.FindAsync(rideRequest.DriverId);
            if (driver == null)
                return NotFound(new { Message = "Driver not found." });

            return Ok(driver);
        }



        //confirm request from customer
        [HttpPost("confirmRequest/{requestId}")]
        public async Task<ActionResult> ConfirmRideRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            if (rideRequest == null || rideRequest.UserId != userId)
                return NotFound(new { Message = "Request not found or you are not authorized to confirm this request." });

            if (rideRequest.RequestStatus != "Accepted")
                return BadRequest(new { Message = "This request has not been accepted yet." });

            rideRequest.RequestStatus = "Confirmed";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var driver = await _context.Drivers.FindAsync(rideRequest.DriverId);
            if (driver == null)
                return NotFound(new { Message = "Driver not found." });

            var customer = await _context.Customers.FindAsync(rideRequest.CustomerId);
            
            return Ok(customer);
        }

        ////refer driver to driver 
        [HttpPost("referRequest/{requestId}")]
        public async Task<ActionResult> ReferRideRequest(int requestId, [FromBody] int referredDriverId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            var driver =  _context.Drivers.FirstOrDefault(uid => uid.UserId == userId);
            if (rideRequest == null || rideRequest.DriverId != driver.DriverId)
                return NotFound(new { Message = "Request not found or you are not authorized to refer this request." });

            var referredDriver = await _context.Drivers.FindAsync(referredDriverId);
            if (referredDriver == null)
                return NotFound(new { Message = "Referred driver not found." });

            rideRequest.DriverId = referredDriverId;
            rideRequest.RequestStatus = "Referred";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var customer = await _context.Users.FindAsync(rideRequest.UserId);
            var customerInfo = new
            {
                CustomerName = customer.FullName,
                CustomerPhone = customer.PhoneNumber,
                SourceLocation = rideRequest.SourceLocation,
                DestinationLocation = rideRequest.DestinationLocation,
                Status = "Referred",
                ReferredDriver = referredDriver.DriverName

            };

            return Ok(new
            {
                Message = "Request referred to another driver.",
                CustomerInfo = customerInfo
            });
        }
        ////accept driver request from driver
        [HttpPost("acceptReferredRequest/{requestId}")]
        public async Task<ActionResult> AcceptReferredRideRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            if (rideRequest == null)
                return NotFound(new { Message = "Request not found." });
            var driver = _context.Drivers.FirstOrDefault(uid => uid.UserId == userId);
            if (driver == null)
            {
                return NotFound("driver not found");
            }
            if (rideRequest.DriverId != driver.DriverId)
                return Unauthorized(new { Message = "You are not authorized to accept this referred request." });

            if (rideRequest.RequestStatus != "Referred")
                return BadRequest(new { Message = "This request is not available for acceptance." });

            rideRequest.RequestStatus = "Accepted";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var customer = await _context.Users.FindAsync(rideRequest.UserId);
            var referredDriver = await _context.Drivers.FindAsync(rideRequest.DriverId);

            var customerInfo = new
            {
                CustomerName = customer.FullName,
                CustomerPhone = customer.PhoneNumber,
                SourceLocation = rideRequest.SourceLocation,
                DestinationLocation = rideRequest.DestinationLocation,
                DriverName = referredDriver.DriverName,
                Status = "Accepted"
            };

            return Ok(new
            {
                Message = "Request accepted successfully.",
                CustomerInfo = customerInfo
            });
        }


        ////refer customer  to customer
        [HttpPost("referCustomer/{requestId}")]
        public async Task<ActionResult> ReferCustomer(int requestId, [FromBody] ReferCustomerDto referCustomerDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            if (rideRequest == null || rideRequest.UserId != userId)
                return NotFound(new { Message = "Request not found or you are not authorized to refer this request." });

            if (string.IsNullOrWhiteSpace(referCustomerDto.Name) || string.IsNullOrWhiteSpace(referCustomerDto.Phone))
            {
                return BadRequest(new { Message = "Referred customer's name and phone number are required." });
            }

            rideRequest.ReferredCustomerName = referCustomerDto.Name; 
            rideRequest.ReferredCustomerPhone = referCustomerDto.Phone;
            rideRequest.RequestStatus = "Referred";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var referredCustomerInfo = new
            {
                ReferredCustomerName = referCustomerDto.Name,
                ReferredCustomerPhone = referCustomerDto.Phone,
                
                SourceLocation = rideRequest.SourceLocation,
                DestinationLocation = rideRequest.DestinationLocation
            };

            return Ok(new
            {
                Message = "Customer referred successfully.",
                ReferredCustomerInfo = referredCustomerInfo
            });
        }

        ////refer customer accept korbe
        [HttpPost("confirmPickup/{requestId}")]
        public async Task<ActionResult> ConfirmPickup(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized driver" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);
            var customer =  _context.Customers.FirstOrDefault(cid => cid.CustomerId == rideRequest.CustomerId);
            if (rideRequest == null)
                return NotFound(new { Message = "Request not found." });
            var driver = _context.Drivers.FirstOrDefault(uid => uid.UserId == userId);

            if (rideRequest.DriverId != driver.DriverId)
                return Unauthorized(new { Message = "You are not authorized to confirm this pickup." });

            if (rideRequest.RequestStatus == "Referred")
            {
                var referredCustomer = await _context.Customers.FirstOrDefaultAsync(u =>
                    u.CustomerPhoneNumber == rideRequest.ReferredCustomerPhone);

                if (referredCustomer == null)
                    return NotFound(new { Message = "Referred customer not found." });
            }
            else if (rideRequest.RequestStatus == "Pending")
            {
                return BadRequest(new { Message = "This request cannot be confirmed." });
            }

            rideRequest.RequestStatus = "Pickup Confirmed";
            rideRequest.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var customerInfo = new
            {
                CustomerName = customer.CustomerName ?? rideRequest.ReferredCustomerName,
                CustomerPhone = customer.CustomerPhoneNumber ?? rideRequest.ReferredCustomerPhone,
                SourceLocation = rideRequest.SourceLocation,
                DestinationLocation = rideRequest.DestinationLocation
            };

            return Ok(new
            {
                Message = "Pickup confirmed successfully.",
                CustomerInfo = customerInfo
            });
        }
    }
}
