using System.Threading.Tasks;

namespace PhotoHub.Api.Services
{
    public interface ISmsService
    {
        Task<(bool Success, string Status, string? ErrorMessage)> SendSmsAsync(
            string phoneNumber, 
            string message);
    }
}
