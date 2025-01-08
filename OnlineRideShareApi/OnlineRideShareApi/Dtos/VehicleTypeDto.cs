namespace OnlineRideShareApi.Dtos
{
    public class VehicleTypeDto
    {
        public int VehicleTypeId { get; set; }
        public string? VehicleTypeName { get; set; }
        public string? UserId { get; set; }
        public decimal PerKmFare { get; set; }
    }
}
