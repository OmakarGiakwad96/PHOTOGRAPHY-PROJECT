using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Sends a direct custom email notification.
        /// </summary>
        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailNotificationRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
        /// Sends a direct custom SMS notification.
        /// </summary>
        [HttpPost("send-sms")]
        public async Task<IActionResult> SendSms([FromBody] SmsNotificationRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var log = await _notificationService.SendSmsNotificationAsync(request);
            return Ok(new
            {
                message = "SMS processing completed.",
                status = log.Status,
                notificationId = log.NotificationId,
                recipient = log.Recipient,
                sentAt = log.SentAt
            });
        }

        /// <summary>
        /// Triggers Email and SMS notifications for Booking Confirmation.
        /// </summary>
        [HttpPost("booking-confirmation")]
        public async Task<IActionResult> SendBookingConfirmation([FromBody] BookingConfirmationRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _notificationService.SendBookingConfirmationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers Email and SMS notifications for Booking Reminder.
        /// </summary>
        [HttpPost("booking-reminder")]
        public async Task<IActionResult> SendBookingReminder([FromBody] BookingReminderRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _notificationService.SendBookingReminderAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers Email and SMS notifications for Payment Success.
        /// </summary>
        [HttpPost("payment-success")]
        public async Task<IActionResult> SendPaymentSuccess([FromBody] PaymentSuccessNotificationRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _notificationService.SendPaymentSuccessNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Triggers Email and SMS notifications for Payment Failure.
        /// </summary>
        [HttpPost("payment-failure")]
        public async Task<IActionResult> SendPaymentFailure([FromBody] PaymentFailureNotificationRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _notificationService.SendPaymentFailureNotificationAsync(request);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves sent notification audit logs with optional filtering by recipient or event type.
        /// </summary>
        [HttpGet("logs")]
        public async Task<ActionResult<IEnumerable<NotificationLog>>> GetNotificationLogs(
            [FromQuery] string? recipient = null, 
            [FromQuery] string? eventType = null)
        {
            var logs = await _notificationService.GetNotificationLogsAsync(recipient, eventType);
            return Ok(logs);
        }
    }
}
