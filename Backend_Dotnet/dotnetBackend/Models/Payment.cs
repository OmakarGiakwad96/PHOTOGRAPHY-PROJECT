using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("Payments")]
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long PaymentId { get; set; }

        [Required]
        public long BookingId { get; set; }

        public long UserId { get; set; }

        public long PhotographerId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [MaxLength(10)]
        public string Currency { get; set; } = "₹";

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Razorpay"; // Razorpay, Credit Card, UPI, NetBanking

        [MaxLength(100)]
        public string PaymentGateway { get; set; } = "Razorpay Gateway";

        [MaxLength(100)]
        public string TransactionId { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? RazorpayOrderId { get; set; }

        [MaxLength(100)]
        public string? RazorpayPaymentId { get; set; }

        [MaxLength(255)]
        public string? RazorpaySignature { get; set; }

        [Required]
        [MaxLength(30)]
        public string PaymentStatus { get; set; } = "Completed"; // Pending, Completed, Failed, Refunded, PartiallyRefunded

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
