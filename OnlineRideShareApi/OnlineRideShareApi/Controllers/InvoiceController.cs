using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoiceController(AppDbContext context)
        {
           _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetAllInvoice()
        {
            var invoice = await _context.Invoices.AsNoTracking().ToListAsync(); 
            return invoice;
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Invoice>> InvoiceGetById(int? id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice is null)
            {
                return NotFound();
            }
            return Ok(invoice);
        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Invoice>> DeleteInvoice(int? id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) { 
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            var result = await _context.SaveChangesAsync();
            if(result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Invoice delete successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = "delete failed"
            });
        }
    }
}
