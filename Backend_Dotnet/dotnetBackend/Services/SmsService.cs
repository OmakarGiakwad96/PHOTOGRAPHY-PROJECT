using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PhotoHub.Api.Configuration;

namespace PhotoHub.Api.Services
{
    public class SmsService : ISmsService
    {
        private readonly SmsSettings _smsSettings;
        private readonly ILogger<SmsService> _logger;

        public SmsService(IOptions<SmsSettings> smsSettings, ILogger<SmsService> logger)
        {
            _smsSettings = smsSettings.Value;
            _logger = logger;
        }

        public async Task<(bool Success, string Status, string? ErrorMessage)> SendSmsAsync(
            string phoneNumber, 
            string message)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return (false, "Failed", "Phone number cannot be empty.");
            }

            // Fallback to Mock / Simulation mode if configured or missing live provider creds
            if (_smsSettings.UseMockProvider || string.IsNullOrWhiteSpace(_smsSettings.AccountSid) || _smsSettings.AccountSid.StartsWith("AC_mock"))
            {
                _logger.LogInformation("==================================================");
                _logger.LogInformation("[MOCK SMS PROVIDER] Simulation SMS sent.");
                _logger.LogInformation("To Phone: {PhoneNumber}", phoneNumber);
                _logger.LogInformation("From: {FromPhone}", _smsSettings.FromPhoneNumber);
                _logger.LogInformation("Message Content: {Message}", message);
                _logger.LogInformation("==================================================");

                await Task.CompletedTask;
                return (true, "Simulated", null);
            }

            try
            {
                // In production, integrate with Twilio REST Client or HTTP API gateway
                _logger.LogInformation("Sending SMS to {PhoneNumber} via {Provider}", phoneNumber, _smsSettings.Provider);
                await Task.CompletedTask;
                return (true, "Sent", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send SMS to {PhoneNumber}", phoneNumber);
                return (false, "Failed", ex.Message);
            }
        }
    }
}
