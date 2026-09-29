using System.Threading.Tasks;

namespace PhotoHub.Api.Services
{
    public interface IEmailService
    {
        Task<(bool Success, string Status, string? ErrorMessage)> SendEmailAsync(
            string recipientEmail, 
            string subject, 
            string body, 
            bool isHtml = true);
    }
}
