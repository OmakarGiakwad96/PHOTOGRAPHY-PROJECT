using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhotoHub.Api.Models
{
    [Table("NotificationPreferences")]
    public class NotificationPreference
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long? UserId { get; set; }

        [Required]
        [MaxLength(30)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Email { get; set; }

        public bool WhatsAppConsent { get; set; } = true;

        public bool SmsConsent { get; set; } = true;

        public bool EmailConsent { get; set; } = true;

        public bool PromotionalConsent { get; set; } = false;

        [MaxLength(50)]
        public string ConsentSource { get; set; } = "Checkout"; // Checkout, Settings, Registration

        [MaxLength(50)]
        public string? ConsentIpAddress { get; set; }

        public DateTime ConsentTimestamp { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
