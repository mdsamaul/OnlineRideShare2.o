using MimeKit;
using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;
namespace OnlineRideShareApi.Service
{
    public class EmailService
    {
        private readonly string smtpServer = "smtp.gmail.com"; // SMTP সার্ভার
        private readonly int smtpPort = 587; // SMTP পোর্ট
        private readonly string senderEmail = "mdsamaul843@gmail.com"; // আপনার ইমেইল
        private readonly string senderPassword = "rwac eeqi kxci xlwl"; // আপনার ইমেইল পাসওয়ার্ড

        public async Task<bool> SendEmailAsync(string recipientEmail, string subject, string message)
        {
            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("Online Ride Share Invoce", senderEmail));
                emailMessage.To.Add(new MailboxAddress("", recipientEmail));
                emailMessage.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = message
                };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}