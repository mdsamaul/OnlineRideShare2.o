namespace OnlineRideShareApi.Dtos
{
    public class RideRequestDto
    {
        public int? DriverId { get; set; }
        public string? UserId { get; set; }
        public string? SourceLocation { get; set; }
        public string? DestinationLocation { get; set; }
    }

}
