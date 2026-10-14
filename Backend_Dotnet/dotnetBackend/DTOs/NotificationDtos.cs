using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PhotoHub.Api.DTOs
{
    public class EmailNotificationRequestDto
    {
        [Required]
        [EmailAddress]
        public string RecipientEmail { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Body { get; set; } = string.Empty;

        public bool IsHtml { get; set; } = true;

        public string? ReferenceId { get; set; }
    }

    public class SmsNotificationRequestDto
    {
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string? TemplateId { get; set; }

        public Dictionary<string, string>? TemplateVars { get; set; }

        public string? ReferenceId { get; set; }

        public string? IdempotencyKey { get; set; }
    }

    public class WhatsAppNotificationRequestDto
    {
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string TemplateName { get; set; } = string.Empty;

        public List<string> BodyParameters { get; set; } = new List<string>();

        public string? ReferenceId { get; set; }

        public string? IdempotencyKey { get; set; }
    }

    public class BookingConfirmationRequestDto
    {
        [Required]
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        public string? CustomerPhone { get; set; }

        public string PhotographerName { get; set; } = "Selected Photographer";

        public DateTime EventDate { get; set; } = DateTime.UtcNow.AddDays(7);

        public string Location { get; set; } = "Client Location / Studio";

        public string PackageName { get; set; } = "Standard Photography Package";

        public decimal Amount { get; set; }

        public string? BookingUrl { get; set; }

        public string? IdempotencyKey { get; set; }
    }

    public class BookingRequestNotificationDto
    {
        [Required]
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;

        public string PhotographerName { get; set; } = "Photographer";

        public DateTime EventDate { get; set; }

        public string Location { get; set; } = "Venue Location";

        public decimal TotalAmount { get; set; }
    }

    public class PhotographerStatusNotificationDto
    {
        [Required]
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;

        public string PhotographerName { get; set; } = string.Empty;

        public string Status { get; set; } = "Accepted"; // Accepted, Rejected

        public string? Reason { get; set; }

        public DateTime EventDate { get; set; }
    }

    public class BookingCancellationNotificationDto
    {
        [Required]
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;

        public string PhotographerName { get; set; } = "Photographer";

        public string Reason { get; set; } = "User requested cancellation";

        public decimal RefundAmount { get; set; }

        public DateTime EventDate { get; set; }
    }

    public class RefundStatusNotificationDto
    {
        [Required]
        public long RefundId { get; set; }

        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string RefundStatus { get; set; } = "Processed"; // Initiated, Processed, Completed, Failed

        public string? TransactionId { get; set; }
    }

    public class OtpVerificationNotificationDto
    {
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string OtpCode { get; set; } = string.Empty;

        public string CustomerName { get; set; } = "User";

        public int ExpiryMinutes { get; set; } = 10;

        public string Channel { get; set; } = "SMS";

        public string? Email { get; set; }
    }

    public class BookingReminderRequestDto
    {
        [Required]
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string CustomerEmail { get; set; } = string.Empty;

        public string? CustomerPhone { get; set; }

        public string PhotographerName { get; set; } = "Selected Photographer";

        public DateTime EventDate { get; set; }

        public string Location { get; set; } = "Scheduled Location";

        public string? BookingUrl { get; set; }
    }

    public class PaymentSuccessNotificationRequestDto
    {
        [Required]
        public long PaymentId { get; set; }

        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        public string? CustomerEmail { get; set; }

        public string? CustomerPhone { get; set; }

        public string PhotographerName { get; set; } = "Selected Photographer";

        public DateTime? EventDate { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "INR";

        public string TransactionId { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = "Razorpay Standard";

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;

        public string? InvoiceUrl { get; set; }

        public string? BookingUrl { get; set; }

        public string? IdempotencyKey { get; set; }
    }

    public class PaymentFailureNotificationRequestDto
    {
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        public string? CustomerEmail { get; set; }

        public string? CustomerPhone { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "INR";

        public string FailureReason { get; set; } = "Transaction failed or cancelled";

        public string? TransactionId { get; set; }

        public string? RetryUrl { get; set; }
    }

    public class NotificationPreferenceDto
    {
        public long? UserId { get; set; }

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public string? Email { get; set; }

        public bool WhatsAppConsent { get; set; } = true;

        public bool SmsConsent { get; set; } = true;

        public bool EmailConsent { get; set; } = true;

        public bool PromotionalConsent { get; set; } = false;

        public string ConsentSource { get; set; } = "Settings";
    }

    public class BroadcastNotificationDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string Audience { get; set; } = "All"; // All, Photographers, Clients

        public List<string> Channels { get; set; } = new List<string> { "WhatsApp", "SMS", "Email" };
    }

    public class NotificationResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool WhatsAppSent { get; set; }
        public bool SmsSent { get; set; }
        public bool EmailSent { get; set; }
        public List<long> NotificationLogIds { get; set; } = new List<long>();
    }

    public class NotificationStatsDto
    {
        public int TotalNotifications { get; set; }
        public int DeliveredCount { get; set; }
        public int SentCount { get; set; }
        public int PendingCount { get; set; }
        public int FailedCount { get; set; }
        public int WhatsAppCount { get; set; }
        public int SmsCount { get; set; }
        public int EmailCount { get; set; }
        public double DeliveryRate { get; set; }
    }
}
