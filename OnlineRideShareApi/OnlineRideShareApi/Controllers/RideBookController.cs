using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.Language;
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
        public async Task<ActionResult> CreateRidebook(RideBookDto rideBookDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User is not authorized.");
            }

            // RideBookDto to RideBook conversion
            

            // GeoCoding to get coordinates
            var (sourceLat, sourceLon) = await _geoCodingService.GetCoordinatesFromAddressAsync(rideBookDto.SourceLocation);
            if (sourceLat == 0 || sourceLon == 0)
            {
                return BadRequest("Invalid source location coordinates.");
            }

            var (destinationLat, destinationLon) = await _geoCodingService.GetCoordinatesFromAddressAsync(rideBookDto.DestinationLocation);
            if (destinationLat == 0 || destinationLon == 0)
            {
                return BadRequest("Invalid destination location coordinates.");
            }

            var rideBook = new RideBook
            {
                UserId = userId,
                DriverVehicleId = rideBookDto.DriverVehicleId,
                ReferenceName = rideBookDto.ReferenceName,
                ReferencePhoneNumber = rideBookDto.ReferencePhoneNumber,
                SourceLatitude = (float?)sourceLat,
                SourceLongitude = (float?)sourceLon,
                DestinationLatitude = (float?)destinationLat,
                DestinationLongitude = (float?)destinationLon,
                StartTime = rideBookDto.StartTime,
                EndTime = rideBookDto.EndTime,
                TotalFare = rideBookDto.TotalFare,
                IsPaid = rideBookDto.IsPaid,
                DriverRating = rideBookDto.DriverRating,
                CustomerRating = rideBookDto.CustomerRating,
                DistanceInMeters = rideBookDto.DistanceInMeters,
                CustomerId = rideBookDto.CustomerId,
            };

            // Distance calculation
            var distance = CalculateDistance(sourceLat, sourceLon, destinationLat, destinationLon);
            rideBook.DistanceInMeters = (int)(float)distance;
            
            const double baseFare = 50;
            var driverVehicleEx = await _context.DriverVehicles.FindAsync(rideBookDto.DriverVehicleId);
            if (driverVehicleEx == null)
            {
                return NotFound("Driver vehicle not found.");
            }

            var vehicle = await _context.Vehicles.FindAsync(driverVehicleEx.VehicleId);
            if (vehicle == null)
            {
                return NotFound("Vehicle not found.");
            }

            var vehicleType = await _context.VehicleTypes.FindAsync(vehicle.VehicleId);
            if (vehicleType == null)
            {
                return NotFound("Vehicle type not found.");
            }

            float perKmFare = (float)vehicleType.PerKmFare;

            // Calculate total fare
            rideBook.TotalFare = (decimal)(baseFare + (distance * perKmFare));

           
            // Add the new RideBook to the context and save
            await _context.RideBooks.AddAsync(rideBook);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                RideTrack rideTrackObj = new RideTrack
                {
                    RideBookId = rideBook.RideBookId,
                    Distance = (int)(float)distance,
                    RideTrackLatitude = (float)sourceLat,
                    RideTrackLongitude = (float)sourceLon,
                    Timestamp = DateTime.Now
                };
                if (rideTrackObj != null)
                {
                    await _context.RideTracks.AddAsync(rideTrackObj);
                    await _context.SaveChangesAsync();
                }
                // Update driver availability status
                var driverVehicle = await _context.DriverVehicles.FindAsync(rideBook.DriverVehicleId);
                if (driverVehicle != null)
                {
                    var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.DriverId == driverVehicle.DriverId);
                    if (driver != null)
                    {
                        driver.IsAvailable = false;
                        _context.Drivers.Update(driver);
                        await _context.SaveChangesAsync();
                    }
                }

                // Return the newly created RideBook as a response
                return Ok(new RideBookDto
                {
                    RideBookId = rideBook.RideBookId,
                    CustomerId = rideBook.CustomerId,
                    DriverVehicleId = rideBook.DriverVehicleId,
                    ReferenceName = rideBook.ReferenceName,
                    ReferencePhoneNumber = rideBook.ReferencePhoneNumber,
                    SourceLatitude = (float?)sourceLat,
                    SourceLongitude = (float?)sourceLon,
                    DestinationLatitude = (float?)destinationLat,
                    DestinationLongitude = (float?)destinationLon,
                    StartTime = rideBook.StartTime,
                    EndTime = rideBook.EndTime,
                    TotalFare = rideBook.TotalFare,
                    IsPaid = rideBook.IsPaid,
                    DriverRating = rideBook.DriverRating,
                    CustomerRating = rideBook.CustomerRating,
                    DistanceInMeters = rideBook.DistanceInMeters
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Ridebook creation failed."
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
                        totalFare = totalFare + 50
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
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { Message = "Unauthorized user" });

            if (rideRequestDto == null || rideRequestDto.DriverId == null)
                return BadRequest(new { Message = "DriverId is required to create a ride request." });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User not found." });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
            if (customer == null)
            {
                customer = new Customer
                {
                    UserId = userId,
                    CustomerPhoneNumber = user.PhoneNumber ?? "N/A",
                    CustomerEmail = user.Email ?? "N/A",
                    CustomerNID = "", 
                };
                customer.SetCreateInfo();
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }

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
                return Ok(new
                {
                    Message = "Ride request created successfully.",
                    RequestId = newRequest.RequestId
                });
            }

            return BadRequest(new { Message = "Failed to create ride request." });
        }

        [HttpGet("getRequest/{requestId}")]
        public async Task<ActionResult> GetRideRequest(int requestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var rideRequest = await _context.RideRequests.FindAsync(requestId);

            if (rideRequest == null)
                return NotFound(new { Message = "Request not found." });
            var driver = await _context.Drivers.FirstOrDefaultAsync(did => did.DriverId == rideRequest.DriverId);
            var customer = await _context.Customers.FirstOrDefaultAsync(cid => cid.CustomerId == rideRequest.CustomerId && rideRequest.UserId == userId);
       
            bool isCustomer = customer != null && customer.UserId == userId;
            bool isDriver = driver != null && driver.UserId == userId;

            if (!isCustomer && !isDriver)
                return Unauthorized(new { Message = "You are not authorized to view this request." });

            return Ok(rideRequest);
        }

        //get request by driver 
        [HttpGet("ForDriver")]
        public async Task<ActionResult> GetRideRequestsForDriver()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user" });

            var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.UserId == userId);

            if (driver == null)
                return NotFound(new { Message = "Driver not found." });

            var rideRequests = await _context.RideRequests
                .Where(r => r.DriverId == driver.DriverId && r.RequestStatus == "Pending")
                .ToListAsync();

            if (rideRequests.Count == 0)
                return NotFound(new { Message = "No pending requests found for this driver." });

            return Ok(rideRequests);
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
            var driver = await _context.Drivers.FirstOrDefaultAsync(did => did.DriverId == rideRequest.DriverId);
            var customer = await _context.Customers.FirstOrDefaultAsync(cid => cid.CustomerId == rideRequest.CustomerId && rideRequest.UserId == userId);
  
            bool isCustomer = customer != null && customer.UserId == userId;
            bool isDriver = driver != null && driver.UserId == userId;

            if (!isCustomer && !isDriver)
                return Unauthorized(new { Message = "You are not authorized to view this request." });
                  
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
