using System.Net.NetworkInformation;
namespace OnlineRideShareApi.Models
{
    public class BaseEntity
    {
        public string CreateBy { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; }
        public string? UpdateBy { get; set; } = string.Empty;
        public DateTime? UpdateDate { get; set; }
        public bool IsActive { get; set; }

        public BaseEntity()
        {
            IsActive = true;
        }
        public void SetCreateInfo()
        {
            CreateBy = getMacAddress();
            CreateDate= DateTime.Now;
        }
        public void SetUpdateInfo()
        {
            UpdateBy = getMacAddress();
            UpdateDate = DateTime.Now;
        }
        private string getMacAddress()
        {
            try
            {
                var networkInterfaces = NetworkInterface.GetAllNetworkInterfaces();
                foreach (var networkInterface in networkInterfaces)
                {
                    if(networkInterface.OperationalStatus == OperationalStatus.Up)
                    {
                        return networkInterface.GetPhysicalAddress().ToString();
                    }
                }
                return "Unknown MAC";
            }catch
            {
                return "Error Retrieving MAC";
            }
        }
    }
}
