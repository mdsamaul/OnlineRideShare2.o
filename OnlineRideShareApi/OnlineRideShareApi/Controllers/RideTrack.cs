using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Models;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RideTrackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RideTrackController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RideTrack/{rideBookId}
        [HttpGet("{rideBookId}")]
        public async Task<IActionResult> GetRideTracks(int rideBookId)
        {
            var tracks = await _context.RideTracks
                                       .Where(rt => rt.RideBookId == rideBookId)
                                       .OrderBy(rt => rt.Timestamp)
                                       .ToListAsync();
            return Ok(tracks);
        }

        // POST: api/RideTrack
        [HttpPost]
        public async Task<IActionResult> AddRideTrack([FromBody] RideTrack track)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.RideTracks.Add(track);
            await _context.SaveChangesAsync();
            return Ok(track);
        }
    }

}
