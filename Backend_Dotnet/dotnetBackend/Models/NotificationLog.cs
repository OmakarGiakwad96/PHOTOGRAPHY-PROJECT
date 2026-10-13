using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("NotificationLogs")]
    public class NotificationLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long NotificationId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Recipient { get; set; } = string.Empty; // E.164 phone number or email address

        [Required]
        [MaxLength(20)]
        public string NotificationType { get; set; } = "WhatsApp"; // WhatsApp, SMS, Email

        [Required]
        [MaxLength(50)]
        public string EventType { get; set; } = "General"; // BookingRequest, BookingConfirmation, PaymentSuccess, PaymentFailure, PhotographerAccepted, PhotographerRejected, BookingCancelled, RefundStatus, BookingReminder, OtpVerification, Custom

        [MaxLength(255)]
        public string? Subject { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string Message { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? TemplateName { get; set; } // Approved WhatsApp / DLT Template name

        [MaxLength(150)]
        public string? ProviderMessageId { get; set; } // Meta wamid.HBg... or MSG91 request_id

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Pending"; // Pending, Queued, Accepted, Sent, Delivered, Read, Failed, Simulated

        public int RetryCount { get; set; } = 0;

        public int MaxRetries { get; set; } = 3;

        public DateTime? NextRetryAt { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public DateTime? DeliveredAt { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(1000)]
        public string? ErrorMessage { get; set; }

        [MaxLength(100)]
        public string? ReferenceId { get; set; } // BookingId, PaymentId, RefundId

        [MaxLength(150)]
        public string? IdempotencyKey { get; set; } // Unique key for duplicate send prevention

        [Column(TypeName = "TEXT")]
        public string? PayloadJson { get; set; } // Serialized request parameters for safe retry
    }
}
