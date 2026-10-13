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

            var isConfigured = !string.IsNullOrWhiteSpace(_smsSettings.AuthKey)
                               && !_smsSettings.AuthKey.StartsWith("mock")
                               && !_smsSettings.AuthKey.StartsWith("YOUR_")
                               && !_smsSettings.UseMockProvider;

            if (!isConfigured)
            {
                var mockRequestId = $"msg91_req_{Guid.NewGuid():N}";
                _logger.LogInformation("==================================================");
                _logger.LogInformation("[INDIAN SMS GATEWAY - MSG91 SIMULATION]");
                _logger.LogInformation("To: {Phone}", normalizedPhone);
                _logger.LogInformation("Sender ID: {SenderId}", _smsSettings.SenderId);
                _logger.LogInformation("Template ID: {TemplateId}", templateId ?? _smsSettings.TemplateId);
                _logger.LogInformation("Message Content: {Message}", message);
                _logger.LogInformation("Mock Request ID: {RequestId}", mockRequestId);
                _logger.LogInformation("==================================================");

                return (true, "Simulated", mockRequestId, null);
            }

            try
            {
                // MSG91 Flow API (Recommended for Indian DLT transactional messaging)
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
