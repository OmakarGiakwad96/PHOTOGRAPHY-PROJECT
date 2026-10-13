using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhotoHub.Api.Services
{
    public interface ISmsService
    {
        /// <summary>
        /// Sends an SMS notification via Indian telecom gateway (MSG91) with DLT compliance or configured provider.
        /// </summary>
        Task<(bool Success, string Status, string? ProviderMessageId, string? ErrorMessage)> SendSmsAsync(
            string phoneNumber, 
            string message, 
            string? templateId = null, 
            Dictionary<string, string>? templateVars = null, 
            string? idempotencyKey = null);

        /// <summary>
        /// Processes inbound delivery status reports from the SMS gateway.
        /// </summary>
        Task<bool> ProcessDeliveryWebhookAsync(string webhookJson);
    }
}
