using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
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
    public class WhatsAppService : IWhatsAppService
    {
        private readonly WhatsAppSettings _settings;
        private readonly HttpClient _httpClient;
        private readonly PhotoHubDbContext _dbContext;
        private readonly ILogger<WhatsAppService> _logger;

        public WhatsAppService(
            IOptions<WhatsAppSettings> settings,
            HttpClient httpClient,
            PhotoHubDbContext dbContext,
            ILogger<WhatsAppService> logger)
        {
            _settings = settings.Value;
            _httpClient = httpClient;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<(bool Success, string Status, string? ProviderMessageId, string? ErrorMessage)> SendTemplateMessageAsync(
            string toPhone,
            string templateName,
            List<string> bodyParameters,
            string? idempotencyKey = null)
        {
            var normalizedPhone = NormalizePhoneNumber(toPhone);
            if (string.IsNullOrWhiteSpace(normalizedPhone))
            {
                return (false, "Failed", null, "Invalid recipient phone number.");
            }

            // Check if live credentials exist
            var isConfigured = !string.IsNullOrWhiteSpace(_settings.PhoneNumberId)
                               && !string.IsNullOrWhiteSpace(_settings.AccessToken)
                               && !_settings.AccessToken.StartsWith("YOUR_")
                               && !_settings.UseMockProvider;

            if (!isConfigured)
            {
                var mockMessageId = $"wamid_mock_{Guid.NewGuid():N}";
                _logger.LogInformation("==================================================");
                _logger.LogInformation("[META WHATSAPP CLOUD API - SIMULATION MODE]");
                _logger.LogInformation("Recipient: {Phone}", normalizedPhone);
                _logger.LogInformation("Template: {Template}", templateName);
                _logger.LogInformation("Parameters: {Params}", string.Join(" | ", bodyParameters));
                _logger.LogInformation("Mock Message ID: {MessageId}", mockMessageId);
                _logger.LogInformation("==================================================");

                return (true, "Simulated", mockMessageId, null);
            }

            try
            {
                var apiVersion = string.IsNullOrWhiteSpace(_settings.ApiVersion) ? "v20.0" : _settings.ApiVersion;
                var url = $"https://graph.facebook.com/{apiVersion}/{_settings.PhoneNumberId}/messages";

                // Build Meta WhatsApp Template Payload
                var payload = new
                {
                    messaging_product = "whatsapp",
                    recipient_type = "individual",
                    to = normalizedPhone,
                    type = "template",
                    template = new
                    {
                        name = templateName,
                        language = new { code = "en" },
                        components = new[]
                        {
                            new
                            {
                                type = "body",
                                parameters = bodyParameters.Select(p => new { type = "text", text = p }).ToArray()
                            }
                        }
                    }
                };

                var jsonPayload = JsonSerializer.Serialize(payload);
                var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
                };
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.AccessToken);

                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    using var doc = JsonDocument.Parse(responseContent);
                    var root = doc.RootElement;
                    string? messageId = null;

                    if (root.TryGetProperty("messages", out var messagesEl) && messagesEl.GetArrayLength() > 0)
                    {
                        messageId = messagesEl[0].GetProperty("id").GetString();
                    }

                    _logger.LogInformation("WhatsApp template '{Template}' accepted by Meta. MessageId: {MessageId}", templateName, messageId);
                    
                    // Note: Status is 'Accepted' until delivery webhook confirms 'Delivered'
                    return (true, "Accepted", messageId, null);
                }
                else
                {
                    string safeError = $"Meta API Error (HTTP {response.StatusCode})";
                    try
                    {
                        using var errDoc = JsonDocument.Parse(responseContent);
                        if (errDoc.RootElement.TryGetProperty("error", out var errorEl))
                        {
                            var msg = errorEl.GetProperty("message").GetString();
                            var code = errorEl.GetProperty("code").GetInt32();
                            safeError = $"Meta API [{code}]: {msg}";
                        }
                    }
                    catch
                    {
                        safeError = $"Meta API HTTP {response.StatusCode}";
                    }

                    _logger.LogWarning("Failed to dispatch WhatsApp message to {Phone}. Error: {Error}", normalizedPhone, safeError);
                    return (false, "Failed", null, safeError);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error communicating with Meta WhatsApp API for {Phone}", normalizedPhone);
                return (false, "Failed", null, ex.Message);
            }
        }

        public bool VerifyWebhookSignature(string rawBody, string signatureHeader)
        {
            if (string.IsNullOrWhiteSpace(_settings.AppSecret))
            {
                // If AppSecret not configured in test environment, allow request
                return true;
            }

            if (string.IsNullOrWhiteSpace(signatureHeader) || !signatureHeader.StartsWith("sha256="))
            {
                return false;
            }

            var expectedHash = signatureHeader.Substring("sha256=".Length);
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_settings.AppSecret));
            var computedBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawBody));
            var computedHex = Convert.ToHexString(computedBytes).ToLowerInvariant();

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(computedHex),
                Encoding.UTF8.GetBytes(expectedHash.ToLowerInvariant()));
        }

        public async Task<bool> ProcessDeliveryWebhookAsync(string webhookJson)
        {
            try
            {
                using var doc = JsonDocument.Parse(webhookJson);
                var root = doc.RootElement;

                if (!root.TryGetProperty("entry", out var entryArray)) return false;

                foreach (var entry in entryArray.EnumerateArray())
                {
                    if (!entry.TryGetProperty("changes", out var changesArray)) continue;

                    foreach (var change in changesArray.EnumerateArray())
                    {
                        if (!change.TryGetProperty("value", out var val)) continue;

                        // Check for status updates
                        if (val.TryGetProperty("statuses", out var statusesArray))
                        {
                            foreach (var statusEl in statusesArray.EnumerateArray())
                            {
                                var wamid = statusEl.GetProperty("id").GetString();
                                var statusStr = statusEl.GetProperty("status").GetString(); // sent, delivered, read, failed

                                if (string.IsNullOrEmpty(wamid) || string.IsNullOrEmpty(statusStr)) continue;

                                var log = await _dbContext.NotificationLogs
                                    .FirstOrDefaultAsync(n => n.ProviderMessageId == wamid);

                                if (log != null)
                                {
                                    // Status progression: Pending/Accepted -> Sent -> Delivered -> Read
                                    if (statusStr == "delivered")
                                    {
                                        log.Status = "Delivered";
                                        log.DeliveredAt = DateTime.UtcNow;
                                    }
                                    else if (statusStr == "read")
                                    {
                                        log.Status = "Read";
                                        if (!log.DeliveredAt.HasValue) log.DeliveredAt = DateTime.UtcNow;
                                    }
                                    else if (statusStr == "sent" && log.Status != "Delivered" && log.Status != "Read")
                                    {
                                        log.Status = "Sent";
                                    }
                                    else if (statusStr == "failed")
                                    {
                                        log.Status = "Failed";
                                        if (statusEl.TryGetProperty("errors", out var errorsArray) && errorsArray.GetArrayLength() > 0)
                                        {
                                            var err = errorsArray[0];
                                            log.ErrorMessage = $"Meta Webhook Error: {err.GetProperty("title").GetString()} (Code {err.GetProperty("code").GetInt32()})";
                                        }
                                    }

                                    log.UpdatedAt = DateTime.UtcNow;
                                }
                            }
                        }
                    }
                }

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse WhatsApp delivery status webhook");
                return false;
            }
        }

        private static string NormalizePhoneNumber(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return string.Empty;

            // Strip non-numeric characters
            var digitsOnly = Regex.Replace(phone, @"[^\d]", "");

            // If 10 digits (Standard Indian mobile), prepend '91'
            if (digitsOnly.Length == 10)
            {
                return $"91{digitsOnly}";
            }

            // If starts with 0 and length 11 (e.g. 09876543210), strip 0 and prepend 91
            if (digitsOnly.Length == 11 && digitsOnly.StartsWith("0"))
            {
                return $"91{digitsOnly.Substring(1)}";
            }

            return digitsOnly;
        }
    }
}
