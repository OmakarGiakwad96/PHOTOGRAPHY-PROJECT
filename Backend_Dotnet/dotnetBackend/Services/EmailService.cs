using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PhotoHub.Api.Configuration;

namespace PhotoHub.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task<(bool Success, string Status, string? ErrorMessage)> SendEmailAsync(
            string recipientEmail, 
            string subject, 
            string body, 
            bool isHtml = true)
        {
            if (string.IsNullOrWhiteSpace(recipientEmail))
            {
                return (false, "Failed", "Recipient email address cannot be empty.");
            }

            // Fallback to Mock / Simulation mode if configured or missing real credentials
            if (_emailSettings.UseMockProvider || string.IsNullOrWhiteSpace(_emailSettings.SmtpUsername) || _emailSettings.SmtpUsername.Contains("your_app_password"))
            {
                _logger.LogInformation("==================================================");
                _logger.LogInformation("[MOCK EMAIL PROVIDER] Simulation email sent.");
                _logger.LogInformation("To: {Recipient}", recipientEmail);
                _logger.LogInformation("Subject: {Subject}", subject);
                _logger.LogInformation("From: {FromName} <{FromEmail}>", _emailSettings.FromName, _emailSettings.FromEmail);
                _logger.LogInformation("==================================================");

                return (true, "Simulated", null);
            }

            try
            {
                using var mail = new MailMessage
                {
                    From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                mail.To.Add(recipientEmail);

                using var client = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword),
                    EnableSsl = _emailSettings.EnableSsl
                };

                await client.SendMailAsync(mail);
                _logger.LogInformation("Email successfully sent to {Recipient} via SMTP.", recipientEmail);
                return (true, "Sent", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Recipient}", recipientEmail);
                return (false, "Failed", ex.Message);
            }
        }
    }
}
