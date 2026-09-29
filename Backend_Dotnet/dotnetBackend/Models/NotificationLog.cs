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
        public string Recipient { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string NotificationType { get; set; } = "Email"; // Email or SMS

        [Required]
        [MaxLength(50)]
        public string EventType { get; set; } = "General"; // BookingConfirmation, BookingReminder, PaymentSuccess, PaymentFailure, Custom

        [MaxLength(255)]
        public string? Subject { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string Message { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Sent"; // Sent, Simulated, Failed

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]
        public string? ErrorMessage { get; set; }

        [MaxLength(100)]
        public string? ReferenceId { get; set; } // BookingId or PaymentId or TxnId
    }
}
