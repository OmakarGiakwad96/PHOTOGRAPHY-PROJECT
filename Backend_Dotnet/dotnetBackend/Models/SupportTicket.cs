using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("SupportTickets")]
    public class SupportTicket
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long TicketId { get; set; }

        [Required]
        [MaxLength(50)]
        public string TicketNumber { get; set; } = string.Empty; // TICK-YYYYMMDD-XXXX

        public long? UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "TEXT")]
        public string Description { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = "General"; // General, Booking, Payment, Technical, Account

        [MaxLength(20)]
        public string Priority { get; set; } = "Medium"; // Low, Medium, High, Urgent

        [MaxLength(20)]
        public string Status { get; set; } = "Open"; // Open, InProgress, Resolved, Closed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<TicketReply> Replies { get; set; } = new List<TicketReply>();
    }
}
