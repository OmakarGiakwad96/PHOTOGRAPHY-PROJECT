using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("PaymentIssues")]
    public class PaymentIssue
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long IssueId { get; set; }

        public long PaymentId { get; set; }

        public long UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string IssueType { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(30)]
        public string Status { get; set; } = "Open"; // Open, InReview, Resolved, Closed

        public long? ResolvedByAdmin { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
