using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PhotoHub.Api.Configuration;
using PhotoHub.Api.Data;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public class SmsService : ISmsService
    {
        private readonly SmsSettings _smsSettings;
        private readonly HttpClient _httpClient;
        private readonly PhotoHubDbContext _dbContext;
        private readonly ILogger<SmsService> _logger;

        public SmsService(
            IOptions<SmsSettings> smsSettings,
            HttpClient httpClient,
            PhotoHubDbContext dbContext,
            ILogger<SmsService> logger)
        {
            _smsSettings = smsSettings.Value;
            _httpClient = httpClient;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<(bool Success, string Status, string? ProviderMessageId, string? ErrorMessage)> SendSmsAsync(
            string phoneNumber, 
            string message,
            string? templateId = null,
            Dictionary<string, string>? templateVars = null,
            string? idempotencyKey = null)
        {
            var normalizedPhone = NormalizeIndianPhoneNumber(phoneNumber);
            if (string.IsNullOrWhiteSpace(normalizedPhone))
            {
                return (false, "Failed", null, "Invalid phone number format. Must be a valid 10-digit mobile number.");
            }

            var isConfigured = (!string.IsNullOrWhiteSpace(_smsSettings.AuthKey) || !string.IsNullOrWhiteSpace(_smsSettings.TwoFactorApiKey))
                               && !_smsSettings.AuthKey.StartsWith("mock")
                               && !_smsSettings.AuthKey.StartsWith("YOUR_")
                               && !_smsSettings.UseMockProvider;

            if (!isConfigured)
            {
                var mockRequestId = $"sms_req_{Guid.NewGuid():N}";
                _logger.LogInformation("==================================================");
                _logger.LogInformation("[INDIAN SMS GATEWAY SIMULATION]");
                _logger.LogInformation("To: {Phone}", normalizedPhone);
                _logger.LogInformation("Sender ID: {SenderId}", _smsSettings.SenderId);
                _logger.LogInformation("Template ID: {TemplateId}", templateId ?? _smsSettings.TemplateId);
                _logger.LogInformation("Message Content: {Message}", message);
                _logger.LogInformation("Mock Request ID: {RequestId}", mockRequestId);
                _logger.LogInformation("==================================================");

                return (true, "Simulated", mockRequestId, null);
            }

            // 1. 2Factor.in Provider (Instant Indian OTP SMS without DLT)
            var has2Factor = !string.IsNullOrWhiteSpace(_smsSettings.TwoFactorApiKey) 
                             && !_smsSettings.TwoFactorApiKey.StartsWith("your_")
                             && !_smsSettings.TwoFactorApiKey.StartsWith("mock");

            if (has2Factor || (_smsSettings.Provider != null && _smsSettings.Provider.Equals("2Factor", StringComparison.OrdinalIgnoreCase)))
            {
                try
                {
                    string otpCode = "123456";
                    if (templateVars != null && templateVars.TryGetValue("otp", out var v)) otpCode = v;
                    else if (templateVars != null && templateVars.TryGetValue("code", out var v2)) otpCode = v2;
                    else
                    {
                        var match = Regex.Match(message, @"\b\d{6}\b");
                        if (match.Success) otpCode = match.Value;
                    }

                    var phone10 = normalizedPhone.StartsWith("91") && normalizedPhone.Length == 12 
                        ? normalizedPhone.Substring(2) 
                        : normalizedPhone;

                    var url = $"https://2factor.in/API/V1/{_smsSettings.TwoFactorApiKey.Trim()}/SMS/{phone10}/{otpCode}";
                    var response = await _httpClient.GetAsync(url);
                    var respString = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        using var doc = JsonDocument.Parse(respString);
                        var status = doc.RootElement.TryGetProperty("Status", out var s) ? s.GetString() : "Success";
                        var details = doc.RootElement.TryGetProperty("Details", out var d) ? d.GetString() : null;

                        if (status == "Success")
                        {
                            _logger.LogInformation("SMS dispatched via 2Factor.in to {Phone}. SessionId: {Details}", normalizedPhone, details);
                            return (true, "Accepted", details, null);
                        }
                        else
                        {
                            return (false, "Failed", null, $"2Factor error: {details}");
                        }
                    }
                    else
                    {
                        return (false, "Failed", null, $"2Factor HTTP {response.StatusCode}: {respString}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception dispatching SMS via 2Factor to {Phone}", normalizedPhone);
                    return (false, "Failed", null, ex.Message);
                }
            }

            try
            {
                // 2. MSG91 Flow API (Recommended for Indian DLT transactional messaging)
                var url = "https://control.msg91.com/api/v5/flow/";

                var recipientObj = new Dictionary<string, object>
                {
                    { "mobiles", normalizedPhone }
                };

                if (templateVars != null)
                {
                    foreach (var kvp in templateVars)
                    {
                        recipientObj[kvp.Key] = kvp.Value;
                    }
                }

                var payload = new
                {
                    template_id = !string.IsNullOrWhiteSpace(templateId) ? templateId : _smsSettings.TemplateId,
                    sender = _smsSettings.SenderId,
                    short_url = "1",
                    recipients = new[] { recipientObj }
                };

                var jsonPayload = JsonSerializer.Serialize(payload);
                var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
                };
                request.Headers.Add("authkey", _smsSettings.AuthKey);

                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    string? requestId = null;
                    using var doc = JsonDocument.Parse(responseContent);
                    var root = doc.RootElement;
                    if (root.TryGetProperty("request_id", out var reqIdEl))
                    {
                        requestId = reqIdEl.GetString();
                    }
                    else if (root.TryGetProperty("message", out var msgEl))
                    {
                        requestId = msgEl.GetString();
                    }

                    _logger.LogInformation("SMS dispatched via MSG91 for {Phone}. RequestId: {RequestId}", normalizedPhone, requestId);
                    
                    // Initial status accepted at gateway
                    return (true, "Accepted", requestId, null);
                }
                else
                {
                    var errMsg = $"MSG91 API Error (HTTP {response.StatusCode}): {responseContent}";
                    _logger.LogWarning("MSG91 SMS failure for {Phone}: {Error}", normalizedPhone, errMsg);
                    return (false, "Failed", null, errMsg);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception dispatching SMS to {Phone}", normalizedPhone);
                return (false, "Failed", null, ex.Message);
            }
        }

        public async Task<bool> ProcessDeliveryWebhookAsync(string webhookJson)
        {
            try
            {
                using var doc = JsonDocument.Parse(webhookJson);
                var root = doc.RootElement;

                // Handle MSG91 webhook format or array of delivery reports
                string? requestId = null;
                string? status = null;

                if (root.TryGetProperty("requestId", out var rId))
                {
                    requestId = rId.GetString();
                }
                else if (root.TryGetProperty("request_id", out var rId2))
                {
                    requestId = rId2.GetString();
                }

                if (root.TryGetProperty("status", out var st))
                {
                    status = st.GetString();
                }

                if (!string.IsNullOrEmpty(requestId) && !string.IsNullOrEmpty(status))
                {
                    var log = await _dbContext.NotificationLogs
                        .FirstOrDefaultAsync(n => n.ProviderMessageId == requestId);

                    if (log != null)
                    {
                        var normalized = status.ToUpperInvariant();
                        if (normalized.Contains("DELIV") || normalized == "1")
                        {
                            log.Status = "Delivered";
                            log.DeliveredAt = DateTime.UtcNow;
                        }
                        else if (normalized.Contains("FAIL") || normalized == "2")
                        {
                            log.Status = "Failed";
                            log.ErrorMessage = $"SMS Delivery failed: {status}";
                        }

                        log.UpdatedAt = DateTime.UtcNow;
                        await _dbContext.SaveChangesAsync();
                        return true;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse SMS delivery status report");
                return false;
            }
        }

        private static string NormalizeIndianPhoneNumber(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return string.Empty;

            var digitsOnly = Regex.Replace(phone, @"[^\d]", "");

            if (digitsOnly.Length == 10)
            {
                return $"91{digitsOnly}";
            }

            if (digitsOnly.Length == 11 && digitsOnly.StartsWith("0"))
            {
                return $"91{digitsOnly.Substring(1)}";
            }

            if (digitsOnly.Length == 12 && digitsOnly.StartsWith("91"))
            {
                return digitsOnly;
            }

            return digitsOnly;
        }
    }
}
