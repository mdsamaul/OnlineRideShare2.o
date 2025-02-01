using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Service;
using System.Threading.Tasks;

namespace OnlineRideShareApi.Controllers
{
   

    [Route("api/email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController()
        {
            _emailService = new EmailService();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequestDto request)
        {
            bool result = await _emailService.SendEmailAsync(request.RecipientEmail, request.Subject, request.Message);
            if (result)
                return Ok(new { success = true, message = "Email sent successfully!" });

            return BadRequest(new { success = false, message = "Failed to send email." });
        }
    }

   

}
