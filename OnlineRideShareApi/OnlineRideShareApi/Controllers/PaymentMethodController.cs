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
    public class PaymentMethodController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentMethodController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IEnumerable<PaymentMethod>> GetPaymentMethod()
        {
            var paymentMethod = await _context.PaymentMethods.AsNoTracking().ToListAsync();
            return paymentMethod;
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PaymentMethod>> PaymentMethodGetById(int? id)
        {
            var paymentMethod = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethod == null)
            {
                return NotFound();
            }
            return Ok(paymentMethod);
        }
        [HttpPost]
        public async Task<ActionResult> CreatePaymentMethod(PaymentMethod paymentMethod)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            paymentMethod.UserId = userId;
            paymentMethod.SetCreateInfo();
            await _context.AddAsync(paymentMethod);
            var result = await _context.SaveChangesAsync();
            if (result > 0) {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message="Payment Method Create Successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message= "Payment Method Create Faild"
            });
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditPaymentMethod(int? id, PaymentMethod paymentMethod)
        {
            var paymentMethodFormDb = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethodFormDb == null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Payment Method not found"
                });
            }
            paymentMethodFormDb.MethodType = paymentMethod.MethodType;
            paymentMethodFormDb.SetUpdateInfo();
            var result = await _context.SaveChangesAsync();
            if (result > 0) {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Payment Method update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unabale to Method"
            });
        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<PaymentMethod>> DeletePaymentMethodType(int id)
        {
            var paymentMethodType = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethodType is null)
            {
                return NotFound();
            }
            _context.PaymentMethods.Remove(paymentMethodType);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Payment MethodType type delete successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "delete failed"
            });
        }

        [HttpGet("details")]
        public async Task<ActionResult<PaymentMethod>> GetPaymentMethodTypeDetails()
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
            var paymentMethodType = await _context.PaymentMethods
                                            .Where(vt => vt.UserId == currentUserId)
                                            .ToListAsync();

            if (paymentMethodType is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "No payment MethodType type found for this user"
                });
            }
            return Ok(paymentMethodType);
        }
    }
}
