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
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string? ReferenceId { get; set; }
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
    }

    public class BookingReminderRequestDto
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

        public DateTime EventDate { get; set; }

        public string Location { get; set; } = "Scheduled Location";
    }

    public class PaymentSuccessNotificationRequestDto
    {
        [Required]
        public long PaymentId { get; set; }

        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        public string? CustomerPhone { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "INR";

        public string TransactionId { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = "Razorpay / Online";

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;

        public string? InvoiceUrl { get; set; }
    }

    public class PaymentFailureNotificationRequestDto
    {
        public long BookingId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        public string? CustomerPhone { get; set; }

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "₹";

        public string FailureReason { get; set; } = "Transaction failed or cancelled";

        public string? TransactionId { get; set; }
    }

    public class NotificationResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool EmailSent { get; set; }
        public bool SmsSent { get; set; }
        public List<long> NotificationLogIds { get; set; } = new List<long>();
    }
}
