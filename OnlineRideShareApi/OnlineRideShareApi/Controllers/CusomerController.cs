using Microsoft.AspNetCore.Http;
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
    public class CusomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CusomerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Customer>> getCustomer()
        {
            var customer = await _context.Customers.AsNoTracking().ToListAsync();
            return customer;
        }
        [HttpPost]
        public async Task<ActionResult> CreateCustomer(Customer customer)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            customer.UserId = userId;
            customer.SetCreateInfo();
            await _context.AddAsync(customer);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Customer create Success.",
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Customer Create field"
            });
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Customer>> getByIdCustomer(int id)
        {
            var customerFomrDb = await _context.Customers.FindAsync(id);
            if (customerFomrDb is null)
            {
                return NotFound();
            }
            return Ok(customerFomrDb);
        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Customer>> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer is null)
            {
                return NotFound();
            }
            _context.Customers.Remove(customer);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "customers deleted successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unable to delete customers"
            });
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditCustomer(int id, Customer customer)
        {
            var customerFromDb = await _context.Customers.FindAsync(id);
            if (customerFromDb is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "customer not found"
                });
            }
            customerFromDb.CustomerName = customer.CustomerName;
            customerFromDb.CustomerPhoneNumber = customer.CustomerPhoneNumber;
            customerFromDb.CustomerEmail = customer.CustomerEmail;
            customerFromDb.CustomerNID = customer.CustomerNID;
            customerFromDb.CustomerImage = customer.CustomerImage;
            customerFromDb.CustomerLatitude = customer.CustomerLatitude;
            customerFromDb.CustomerLongitude = customer.CustomerLongitude;
            customerFromDb.SetUpdateInfo();

            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "customer Update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unable to customer"
            });
        }
        [HttpGet("details")]
        public async Task<ActionResult<Customer>> CustomerDetails()
        {
            var currentCustomerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(currentCustomerId is null)
            {
                return NotFound(new AuthResponseDto { 
                    IsSuccess= false,
                    Message= "uaser not auththenticate"
                });
            }
            var customer = _context.Customers.Where(cu => cu.UserId == currentCustomerId);
            if (customer is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "no customer found this user"
                });
            }
            return Ok(customer);
        }
        [HttpPost("update-location")]
        public async Task<IActionResult> UpdateCustomerLocation([FromBody] LocationDto locationDto)
        {
            var customerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var customer = await _context.Customers.FirstAsync(c=>c.UserId == customerId);
            if (customer is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Customer not found"
                });
            }
            customer.CustomerLatitude = locationDto.Latitude;
            customer.CustomerLongitude = locationDto.Longitude;
            customer.SetUpdateInfo();
            _context.Customers.Update(customer);
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
