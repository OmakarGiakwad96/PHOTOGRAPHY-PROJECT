using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("ContactSubmissions")]
    public class ContactSubmission
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long SubmissionId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "TEXT")]
        public string Message { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = "General"; // General, Booking, Payment, Technical, Partner

        [MaxLength(20)]
        public string Status { get; set; } = "New"; // New, Reviewed, Closed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
