using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhotoHub.Api.Services
{
    public interface IWhatsAppService
    {
        /// <summary>
        /// Sends an approved WhatsApp Business Cloud API template message.
        /// </summary>
        Task<(bool Success, string Status, string? ProviderMessageId, string? ErrorMessage)> SendTemplateMessageAsync(
            string toPhone, 
            string templateName, 
            List<string> bodyParameters, 
            string? idempotencyKey = null);

        /// <summary>
        /// Verifies the X-Hub-Signature-256 HMAC-SHA256 signature sent by Meta.
        /// </summary>
        bool VerifyWebhookSignature(string rawBody, string signatureHeader);

        /// <summary>
        /// Processes inbound delivery status callbacks from Meta webhook (sent, delivered, read, failed).
        /// </summary>
        Task<bool> ProcessDeliveryWebhookAsync(string webhookJson);
    }
}
