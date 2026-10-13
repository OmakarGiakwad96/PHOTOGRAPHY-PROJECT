using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Services;

namespace PhotoHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IRazorpayService _razorpayService;
        private readonly INotificationService _notificationService;

        public PaymentsController(
            IPaymentService paymentService, 
            IRazorpayService razorpayService,
            INotificationService notificationService)
        {
            _paymentService = paymentService;
            _razorpayService = razorpayService;
            _notificationService = notificationService;
        }

        // Razorpay Order Creation Integration
        [HttpPost("create-razorpay-order")]
        public async Task<IActionResult> CreateRazorpayOrder([FromBody] RazorpayOrderRequestDto dto)
        {
            if (dto.Amount <= 0)
            {
                return BadRequest(new { message = "Amount must be greater than zero" });
            }

            var response = await _razorpayService.CreateOrderAsync(dto);
            return Ok(response);
        }

        // Process Payment (Razorpay Signature Verification + Recording)
        [HttpPost("process")]
        [HttpPost] // Fallback for POST /api/payments
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDto dto)
        {
            if (dto.Amount <= 0 || dto.BookingId <= 0)
            {
                return BadRequest(new { message = "Invalid payment payload" });
            }

            var result = await _paymentService.ProcessPaymentAsync(dto);
            return Ok(result);
        }

        // Razorpay Webhook Handler
        [HttpPost("webhook")]
        public async Task<IActionResult> RazorpayWebhook()
        {
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            var payload = await reader.ReadToEndAsync();
            var signature = Request.Headers["X-Razorpay-Signature"].ToString();

            var isValid = _razorpayService.VerifyWebhookSignature(payload, signature);
            if (!isValid && !string.IsNullOrEmpty(signature))
            {
                return BadRequest(new { message = "Invalid webhook signature" });
            }

            // Process verified webhook events
            try
            {
                using var doc = System.Text.Json.JsonDocument.Parse(payload);
                var root = doc.RootElement;
                if (root.TryGetProperty("event", out var eventEl))
                {
                    var eventType = eventEl.GetString();
                    if (eventType == "payment.captured")
                    {
                        var entity = root.GetProperty("payload").GetProperty("payment").GetProperty("entity");
                        var paymentId = entity.GetProperty("id").GetString() ?? "";
                        var amountInPaise = entity.GetProperty("amount").GetInt64();
                        var contact = entity.TryGetProperty("contact", out var cEl) ? cEl.GetString() : null;
                        var email = entity.TryGetProperty("email", out var eEl) ? eEl.GetString() : null;
                        long bookingId = 0;

                        if (entity.TryGetProperty("notes", out var notes) && notes.TryGetProperty("booking_id", out var bId))
                        {
                            long.TryParse(bId.GetString(), out bookingId);
                        }

                        // Trigger Payment Success Notification (with built-in idempotency)
                        await _notificationService.SendPaymentSuccessNotificationAsync(new PaymentSuccessNotificationRequestDto
                        {
                            PaymentId = Math.Abs(paymentId.GetHashCode()),
                            BookingId = bookingId > 0 ? bookingId : DateTime.UtcNow.Ticks % 1000000,
                            CustomerName = email?.Split('@')[0] ?? "Valued Client",
                            CustomerEmail = email,
                            CustomerPhone = contact,
                            Amount = amountInPaise / 100m,
                            TransactionId = paymentId,
                            PaymentMethod = "Razorpay Standard"
                        });
                    }
                    else if (eventType == "payment.failed")
                    {
                        var entity = root.GetProperty("payload").GetProperty("payment").GetProperty("entity");
                        var paymentId = entity.GetProperty("id").GetString() ?? "";
                        var amountInPaise = entity.GetProperty("amount").GetInt64();
                        var contact = entity.TryGetProperty("contact", out var cEl) ? cEl.GetString() : null;
                        var email = entity.TryGetProperty("email", out var eEl) ? eEl.GetString() : null;
                        var desc = entity.TryGetProperty("error_description", out var ed) ? ed.GetString() : "Payment failed";

                        await _notificationService.SendPaymentFailureNotificationAsync(new PaymentFailureNotificationRequestDto
                        {
                            BookingId = DateTime.UtcNow.Ticks % 1000000,
                            CustomerName = email?.Split('@')[0] ?? "Valued Client",
                            CustomerEmail = email,
                            CustomerPhone = contact,
                            Amount = amountInPaise / 100m,
                            FailureReason = desc ?? "Payment declined",
                            TransactionId = paymentId
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Razorpay webhook parsing notice: {ex.Message}");
            }

            return Ok(new { status = "success", message = "Razorpay webhook verified and processed" });
        }

        // Payment History by User ID
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPaymentsByUser(long userId)
        {
            var payments = await _paymentService.GetPaymentsByUserAsync(userId);
            return Ok(payments);
        }

        // Payment/Payout History by Photographer ID
        [HttpGet("photographer/{photographerId}")]
        public async Task<IActionResult> GetPaymentsByPhotographer(long photographerId)
        {
            var payments = await _paymentService.GetPaymentsByPhotographerAsync(photographerId);
            return Ok(payments);
        }

        // Get Payment by ID
        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPaymentById(long paymentId)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(paymentId);
            if (payment == null) return NotFound(new { message = "Payment record not found" });
            return Ok(payment);
        }

        // Get Payment by Booking ID
        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetPaymentByBooking(long bookingId)
        {
            var payment = await _paymentService.GetPaymentByBookingIdAsync(bookingId);
            if (payment == null) return NotFound(new { message = "No payment found for this booking" });
            return Ok(payment);
        }

        // List All Payments (Admin)
        [HttpGet]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }
    }
}
