using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayment()
        {
            var payments = await _context.Payments
                                         .AsNoTracking()
                                         .OrderByDescending(p => p.PaymentDate) 
                                         .ToListAsync();

            return Ok(payments);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Payment>> GetByIdPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment is null)
            {
                return NotFound();
            }
            return Ok(payment);
        }
       

        [HttpPost("add-payment-invoice")]
        public async Task<IActionResult> AddPaymentInvoice(AddPaymentInvoiceRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
           
            var payment = new Payment
            {
                Amount = request.PaymentAmount,
                UserId = userId,
                PaymentDate = request.PaymentDate,
                Status = request.PaymentStatus,             
            };
           
            var invoice = new Invoice
            {               
                PaymentTime = request.PaymentTime,
                Amount = request.InvoiceAmount,
                UserId = userId,
                DriverId = request.DriverId,
                CustomerId = request.CustomerId,
                PaymentMethodId = request.PaymentMethodId,
                Particular = request.Particular
            };
            invoice.SetCreateInfo();
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            payment.InvoiceId = invoice.InvoiceId;
            payment.SetCreateInfo();
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(new AuthResponseDto{
                IsSuccess = true,
                Message= "Payment successfully"
            });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditPayment(int id, Payment payment)
        {
            var paymentFormDb = await _context.Payments.FindAsync(id);
            if (paymentFormDb is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "payment not found"
                });
            }
            paymentFormDb.InvoiceId=payment.InvoiceId;
            paymentFormDb.Amount=payment.Amount;
            paymentFormDb.PaymentDate=payment.PaymentDate;
            paymentFormDb.Status=payment.Status;
            paymentFormDb.SetUpdateInfo();
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Payment update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "Unabale to Payment"
            });
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Payment>> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment is null)
            {
                return NotFound();
            }
            _context.Payments.Remove(payment);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "payment delete successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "delete failed"
            });
        }
       
        [HttpGet("payment-details")]
        public async Task<ActionResult> GetPaymentDetails()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized user." });

            var payments = await _context.Payments
                .Include(p => p.Invoice)
                .Where(p => p.Invoice.Driver.UserId == userId || p.Invoice.Customer.UserId == userId).OrderByDescending(p => p.PaymentDate)
                .ToListAsync();

            if (payments == null || payments.Count == 0)
                return NotFound(new { Message = "No payment records found." });

            var paymentDtos = payments.Select(p => new PaymentDto
            {
                PaymentId = p.PaymentId,
                InvoiceId = p.InvoiceId,
                Amount = p.Amount,
                PaymentDate = p.PaymentDate,
                Status = p.Status,
                Invoice = p.Invoice == null ? null : new InvoiceDto
                {
                    InvoiceId = p.Invoice.InvoiceId,
                    PaymentTime = p.Invoice.PaymentTime,
                    Amount = p.Invoice.Amount,
                    DriverId = p.Invoice.DriverId,
                    CustomerId = p.Invoice.CustomerId,
                    Particular = p.Invoice.Particular
                }
            }).ToList();

            return Ok(paymentDtos);
        }

    }
}
