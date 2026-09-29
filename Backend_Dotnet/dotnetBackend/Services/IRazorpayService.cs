using System.Threading.Tasks;
using PhotoHub.Api.DTOs;

namespace PhotoHub.Api.Services
{
    public interface IRazorpayService
    {
        Task<RazorpayOrderResponseDto> CreateOrderAsync(RazorpayOrderRequestDto request);
        bool VerifyPaymentSignature(string orderId, string paymentId, string signature);
        bool VerifyWebhookSignature(string payload, string signature);
        Task<string> TriggerRazorpayRefundAsync(string paymentId, decimal amount, string reason);
    }
}
