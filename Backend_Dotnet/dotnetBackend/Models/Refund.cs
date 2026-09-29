using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("Refunds")]
    public class Refund
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long RefundId { get; set; }

        [Required]
        public long BookingId { get; set; }

        [Required]
        public long PaymentId { get; set; }

        public long UserId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal RefundAmount { get; set; }

        [MaxLength(500)]
        public string RefundReason { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string RefundStatus { get; set; } = "Pending"; // Pending, Approved, Rejected, Processed, Failed

        [MaxLength(100)]
        public string? RazorpayRefundId { get; set; }

        public long? ApprovedByAdmin { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ProcessedAt { get; set; }
    }
}
