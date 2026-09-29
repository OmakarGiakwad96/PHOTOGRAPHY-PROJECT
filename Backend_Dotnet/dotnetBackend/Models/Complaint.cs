using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("Complaints")]
    public class Complaint
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ComplaintId { get; set; }

        [Required]
        [MaxLength(50)]
        public string ComplaintNumber { get; set; } = string.Empty; // CMP-YYYYMMDD-XXXX

        public long UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string CustomerEmail { get; set; } = string.Empty;

        public long? BookingId { get; set; }

        [Required]
        [MaxLength(50)]
        public string IssueType { get; set; } = "Other"; // Quality, Delay, Behavior, Billing, Cancellation, Other

        [Required]
        [Column(TypeName = "TEXT")]
        public string Description { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Urgency { get; set; } = "Medium"; // Low, Medium, High, Critical

        [MaxLength(30)]
        public string Status { get; set; } = "Submitted"; // Submitted, UnderInvestigation, Resolved, Rejected

        [Column(TypeName = "TEXT")]
        public string? ResolutionNotes { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }
    }
}
