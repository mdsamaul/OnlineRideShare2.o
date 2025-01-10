using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
namespace OnlineRideShareApi.Service
{
    public class GeoCodingService
    {
        private readonly string _apiKey = "616214030765927600259x8062";  // GeoCode.xyz API Key

        public async Task<(double latitude, double longitude)> GetCoordinatesFromAddressAsync(string address)
        {
            string url = $"https://geocode.xyz/{address}?json=1&auth={_apiKey}";

            using (var client = new HttpClient())
            {
                var response = await client.GetStringAsync(url);
                dynamic jsonResponse = JsonConvert.DeserializeObject(response)!;

                if (jsonResponse.error != null)
                {
                    throw new Exception("Error fetching data from GeoCode.xyz: " + jsonResponse.error.description);
                }

                double latitude = jsonResponse.latt;
                double longitude = jsonResponse.longt;

                return (latitude, longitude);
            }
        }
    }
}
