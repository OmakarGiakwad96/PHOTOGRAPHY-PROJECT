using System;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PhotoHub.Api.Configuration;

namespace PhotoHub.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly HttpClient _httpClient;
        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IOptions<EmailSettings> emailSettings,
            HttpClient httpClient,
            ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _httpClient = httpClient;
            _logger = logger;
        }

        public EmailService(
            IOptions<EmailSettings> emailSettings,
            ILogger<EmailService> logger)
            : this(emailSettings, new HttpClient(), logger)
        {
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

            var plainText = StripHtml(body);

            // 1. Resend API Integration (Preferred modern transactional email)
            var hasResend = !string.IsNullOrWhiteSpace(_emailSettings.ResendApiKey) 
                            && !_emailSettings.ResendApiKey.StartsWith("your_") 
                            && !_emailSettings.ResendApiKey.StartsWith("mock")
                            && !_emailSettings.UseMockProvider;

            if (hasResend)
            {
                try
                {
                    var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
                    request.Headers.Add("Authorization", $"Bearer {_emailSettings.ResendApiKey}");

                    var fromAddress = !string.IsNullOrWhiteSpace(_emailSettings.FromEmail) && _emailSettings.FromEmail.Contains("@")
                        ? $"{_emailSettings.FromName} <{_emailSettings.FromEmail}>"
                        : "PhotoHub Connect <onboarding@resend.dev>";

                    var resendPayload = new
                    {
                        from = fromAddress,
                        to = new[] { recipientEmail.Trim() },
                        subject = subject,
                        html = isHtml ? body : null,
                        text = plainText
                    };

                    request.Content = new StringContent(JsonSerializer.Serialize(resendPayload), Encoding.UTF8, "application/json");

                    var response = await _httpClient.SendAsync(request);
                    var responseBody = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation("Email successfully dispatched via Resend to {Recipient}", recipientEmail);
                        return (true, "Sent", null);
                    }
                    else
                    {
                        var errMsg = $"Resend API error ({response.StatusCode}): {responseBody}";
                        _logger.LogWarning("Resend dispatch failure: {Error}", errMsg);
                        return (false, "Failed", errMsg);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception sending email via Resend to {Recipient}", recipientEmail);
                    return (false, "Failed", ex.Message);
                }
            }

            // 2. SMTP Integration
            var hasSmtp = !string.IsNullOrWhiteSpace(_emailSettings.SmtpUsername) 
                          && !_emailSettings.SmtpUsername.Contains("your_app_password")
                          && !_emailSettings.UseMockProvider;

            if (hasSmtp)
            {
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

                    // Add plain-text alternative view
                    if (isHtml)
                    {
                        var plainView = AlternateView.CreateAlternateViewFromString(plainText, null, "text/plain");
                        mail.AlternateViews.Add(plainView);
                    }

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
                    _logger.LogError(ex, "Failed to send email to {Recipient} via SMTP", recipientEmail);
                    return (false, "Failed", ex.Message);
                }
            }

            // 3. Fallback to Mock / Simulation mode
            _logger.LogInformation("==================================================");
            _logger.LogInformation("[TRANSACTIONAL EMAIL - SIMULATION]");
            _logger.LogInformation("To: {Recipient}", recipientEmail);
            _logger.LogInformation("Subject: {Subject}", subject);
            _logger.LogInformation("From: {FromName} <{FromEmail}>", _emailSettings.FromName, _emailSettings.FromEmail);
            _logger.LogInformation("Plain-text preview: {Preview}", plainText.Length > 100 ? plainText.Substring(0, 100) + "..." : plainText);
            _logger.LogInformation("==================================================");

            return (true, "Simulated", null);
        }

        private static string StripHtml(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            var withoutTags = Regex.Replace(input, "<.*?>", string.Empty);
            return WebUtility.HtmlDecode(withoutTags).Trim();
        }
    }
}
