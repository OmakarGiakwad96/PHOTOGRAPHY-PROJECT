using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("CustomerFeedbacks")]
    public class CustomerFeedback
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long FeedbackId { get; set; }

        public long UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        public long? PhotographerId { get; set; }

        public long? BookingId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; } = 5; // 1 to 5 stars

        [Required]
        [Column(TypeName = "TEXT")]
        public string Comment { get; set; } = string.Empty;

        [MaxLength(50)]
        public string ServiceCategory { get; set; } = "General"; // Wedding, Portrait, Event, Commercial

        public DateTime FeedbackDate { get; set; } = DateTime.UtcNow;
    }
}
