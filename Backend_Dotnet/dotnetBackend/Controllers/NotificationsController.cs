using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PhotoHub.Api.Configuration;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;
using PhotoHub.Api.Services;

namespace PhotoHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IWhatsAppService _whatsAppService;
        private readonly ISmsService _smsService;
        private readonly WhatsAppSettings _whatsAppSettings;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(
            INotificationService notificationService,
            IWhatsAppService whatsAppService,
            ISmsService smsService,
            IOptions<WhatsAppSettings> whatsAppSettings,
            ILogger<NotificationsController> logger)
        {
            _notificationService = notificationService;
            _whatsAppService = whatsAppService;
            _smsService = smsService;
            _whatsAppSettings = whatsAppSettings.Value;
            _logger = logger;
        }

        /// <summary>
        /// Sends an approved WhatsApp template notification.
        /// </summary>
        [HttpPost("send-whatsapp")]
        public async Task<IActionResult> SendWhatsApp([FromBody] WhatsAppNotificationRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var log = await _notificationService.SendWhatsAppNotificationAsync(request);
            return Ok(new
            {
                message = "WhatsApp notification dispatched.",
                status = log.Status,
                notificationId = log.NotificationId,
                recipient = log.Recipient,
                providerMessageId = log.ProviderMessageId,
                sentAt = log.SentAt
            });
        }

        /// <summary>
        /// Sends a direct SMS notification via MSG91 / Indian telecom gateway.
        /// </summary>
        [HttpPost("send-sms")]
        public async Task<IActionResult> SendSms([FromBody] SmsNotificationRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var log = await _notificationService.SendSmsNotificationAsync(request);
            return Ok(new
            {
                message = "SMS processing completed.",
                status = log.Status,
                notificationId = log.NotificationId,
                recipient = log.Recipient,
                providerMessageId = log.ProviderMessageId,
                sentAt = log.SentAt
            });
        }

        /// <summary>
        /// Sends a direct custom email notification.
        /// </summary>
        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailNotificationRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var log = await _notificationService.SendEmailNotificationAsync(request);
            return Ok(new
            {
                message = "Email processing completed.",
                status = log.Status,
                notificationId = log.NotificationId,
                recipient = log.Recipient,
                sentAt = log.SentAt
            });
        }

        /// <summary>
        /// Triggers WhatsApp, SMS, and Email notifications for Booking Confirmation.
        /// </summary>
        [HttpPost("booking-confirmation")]
        public async Task<IActionResult> SendBookingConfirmation([FromBody] BookingConfirmationRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendBookingConfirmationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers WhatsApp and SMS for Booking Request Received.
        /// </summary>
        [HttpPost("booking-request")]
        public async Task<IActionResult> SendBookingRequest([FromBody] BookingRequestNotificationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendBookingRequestNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers WhatsApp, SMS, and Email receipts for verified Payment Success.
        /// </summary>
        [HttpPost("payment-success")]
        public async Task<IActionResult> SendPaymentSuccess([FromBody] PaymentSuccessNotificationRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendPaymentSuccessNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers notifications for verified Payment Failure.
        /// </summary>
        [HttpPost("payment-failure")]
        public async Task<IActionResult> SendPaymentFailure([FromBody] PaymentFailureNotificationRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendPaymentFailureNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers WhatsApp &amp; SMS alerts when photographer accepts or rejects booking.
        /// </summary>
        [HttpPost("photographer-status")]
        public async Task<IActionResult> SendPhotographerStatus([FromBody] PhotographerStatusNotificationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendPhotographerStatusNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers notifications for Booking Cancellation and Refund scheduling.
        /// </summary>
        [HttpPost("booking-cancellation")]
        public async Task<IActionResult> SendBookingCancellation([FromBody] BookingCancellationNotificationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendBookingCancellationNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers notifications for Refund status updates.
        /// </summary>
        [HttpPost("refund-status")]
        public async Task<IActionResult> SendRefundStatus([FromBody] RefundStatusNotificationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendRefundStatusNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers upcoming shoot reminders before scheduled date.
        /// </summary>
        [HttpPost("booking-reminder")]
        public async Task<IActionResult> SendBookingReminder([FromBody] BookingReminderRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendBookingReminderAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Dispatches authentication OTP via WhatsApp and SMS.
        /// </summary>
        [HttpPost("otp-verification")]
        public async Task<IActionResult> SendOtpVerification([FromBody] OtpVerificationNotificationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendOtpVerificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Admin broadcast announcement across WhatsApp, SMS, and Email.
        /// </summary>
        [HttpPost("broadcast")]
        public async Task<IActionResult> SendBroadcast([FromBody] BroadcastNotificationDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _notificationService.SendBroadcastNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Manually retries a failed notification log.
        /// </summary>
        [HttpPost("retry/{notificationId}")]
        public async Task<IActionResult> RetryNotification(long notificationId)
        {
            var success = await _notificationService.RetryFailedNotificationAsync(notificationId);
            return Ok(new { success, message = success ? "Notification retry initiated successfully." : "Failed to retry notification." });
        }

        // ==========================================
        // Meta WhatsApp Webhook Handlers
        // ==========================================

        /// <summary>
        /// Meta WhatsApp Cloud API Webhook Verification (hub.mode, hub.verify_token, hub.challenge).
        /// </summary>
        [HttpGet("whatsapp/webhook")]
        public IActionResult VerifyWhatsAppWebhook(
            [FromQuery(Name = "hub.mode")] string? mode,
            [FromQuery(Name = "hub.verify_token")] string? token,
            [FromQuery(Name = "hub.challenge")] string? challenge)
        {
            var expectedToken = _whatsAppSettings.VerifyToken;

            if (mode == "subscribe" && token == expectedToken)
            {
                _logger.LogInformation("Meta WhatsApp webhook subscription verified successfully.");
                return Content(challenge ?? string.Empty, "text/plain");
            }

            _logger.LogWarning("Meta WhatsApp webhook subscription failed: invalid token.");
            return Forbid();
        }

        /// <summary>
        /// Meta WhatsApp Inbound Delivery Status Callback (sent, delivered, read, failed).
        /// </summary>
        [HttpPost("whatsapp/webhook")]
        public async Task<IActionResult> ProcessWhatsAppWebhook()
        {
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            var rawBody = await reader.ReadToEndAsync();
            var signature = Request.Headers["X-Hub-Signature-256"].ToString();

            // Validate Meta HMAC signature
            var isValid = _whatsAppService.VerifyWebhookSignature(rawBody, signature);
            if (!isValid)
            {
                _logger.LogWarning("Invalid Meta WhatsApp webhook signature.");
                return Unauthorized(new { message = "Invalid signature." });
            }

            var processed = await _whatsAppService.ProcessDeliveryWebhookAsync(rawBody);
            return Ok(new { status = "success", processed });
        }

        // ==========================================
        // Indian SMS Gateway (MSG91) Webhook Handlers
        // ==========================================

        /// <summary>
        /// MSG91 SMS Delivery Status Report Webhook.
        /// </summary>
        [HttpPost("sms/webhook")]
        public async Task<IActionResult> ProcessSmsWebhook()
        {
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            var rawBody = await reader.ReadToEndAsync();

            var processed = await _smsService.ProcessDeliveryWebhookAsync(rawBody);
            return Ok(new { status = "success", processed });
        }

        // ==========================================
        // Customer Preferences & Consent
        // ==========================================

        /// <summary>
        /// Retrieves notification preferences and consent for a user.
        /// </summary>
        [HttpGet("preferences/{userId}")]
        public async Task<IActionResult> GetPreferences(long userId)
        {
            var pref = await _notificationService.GetNotificationPreferencesAsync(userId);
            if (pref == null)
            {
                return Ok(new
                {
                    userId,
                    whatsAppConsent = true,
                    smsConsent = true,
                    emailConsent = true,
                    promotionalConsent = false,
                    phoneNumber = ""
                });
            }
            return Ok(pref);
        }

        /// <summary>
        /// Updates notification preferences and records customer consent.
        /// </summary>
        [HttpPost("preferences")]
        public async Task<IActionResult> SavePreferences([FromBody] NotificationPreferenceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var pref = await _notificationService.SaveNotificationPreferencesAsync(dto);
            return Ok(new
            {
                message = "Preferences and consent updated successfully.",
                preferences = pref
            });
        }

        // ==========================================
        // Audit Logs & Analytics
        // ==========================================

        /// <summary>
        /// Retrieves notification audit logs with channel, eventType, status, and recipient filters.
        /// </summary>
        [HttpGet("logs")]
        public async Task<ActionResult<IEnumerable<NotificationLog>>> GetNotificationLogs(
            [FromQuery] string? recipient = null, 
            [FromQuery] string? eventType = null,
            [FromQuery] string? channel = null,
            [FromQuery] string? status = null)
        {
            var logs = await _notificationService.GetNotificationLogsAsync(recipient, eventType, channel, status);
            return Ok(logs);
        }

        /// <summary>
        /// Retrieves summary statistics and delivery KPI metrics for Admin Dashboard.
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetNotificationStats()
        {
            var stats = await _notificationService.GetNotificationStatsAsync();
            return Ok(stats);
        }

        // ==========================================
        // In-App Notification Center
        // ==========================================

        /// <summary>
        /// Retrieves in-app notifications and unread count for an authenticated user.
        /// </summary>
        [HttpGet("in-app/{userId}")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetInAppNotifications(long userId, [FromQuery] int limit = 30)
        {
            var notifications = await _notificationService.GetUserInAppNotificationsAsync(userId, limit);
            var unreadCount = await _notificationService.GetUnreadInAppNotificationCountAsync(userId);
            return Ok(new
            {
                userId,
                unreadCount,
                notifications
            });
        }

        /// <summary>
        /// Marks a single in-app notification as read.
        /// </summary>
        [HttpPost("in-app/{id}/read")]
        [HttpPut("in-app/{id}/read")]
        public async Task<IActionResult> MarkInAppNotificationRead(long id, [FromQuery] long userId = 0)
        {
            var success = await _notificationService.MarkInAppNotificationAsReadAsync(id, userId);
            return Ok(new { success, message = success ? "Notification marked as read." : "Notification not found or unauthorized." });
        }

        /// <summary>
        /// Marks all in-app notifications for a user as read.
        /// </summary>
        [HttpPost("in-app/read-all/{userId}")]
        [HttpPut("in-app/read-all/{userId}")]
        public async Task<IActionResult> MarkAllInAppNotificationsRead(long userId)
        {
            var success = await _notificationService.MarkAllInAppNotificationsAsReadAsync(userId);
            return Ok(new { success, message = "All notifications marked as read." });
        }

        /// <summary>
        /// Creates a persistent in-app notification.
        /// </summary>
        [HttpPost("in-app/create")]
        public async Task<IActionResult> CreateInAppNotification([FromBody] InAppNotification notificationDto)
        {
            if (notificationDto.UserId <= 0 || string.IsNullOrWhiteSpace(notificationDto.Title))
            {
                return BadRequest(new { message = "UserId and Title are required." });
            }

            var created = await _notificationService.CreateInAppNotificationAsync(
                notificationDto.UserId,
                notificationDto.Role,
                notificationDto.Title,
                notificationDto.Message,
                notificationDto.Type,
                notificationDto.ActionUrl,
                notificationDto.ReferenceId);

            return Ok(created);
        }
    }
}
