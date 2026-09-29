using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PhotoHub.Api.DTOs
{
    // --- Contact Us DTOs ---
    public class CreateContactSubmissionDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Phone]
        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string Category { get; set; } = "General";
    }

    // --- Support Ticket DTOs ---
    public class CreateSupportTicketDto
    {
        public long? UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Category { get; set; } = "General";

        public string Priority { get; set; } = "Medium"; // Low, Medium, High, Urgent
    }

    public class CreateTicketReplyDto
    {
        [Required]
        [MaxLength(100)]
        public string SenderName { get; set; } = string.Empty;

        public bool IsAdmin { get; set; } = false;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string? StatusUpdate { get; set; } // Optional status change on reply e.g. InProgress, Resolved
    }

    public class UpdateTicketStatusDto
    {
        [Required]
        public string Status { get; set; } = "InProgress"; // Open, InProgress, Resolved, Closed

        public string? Priority { get; set; }
    }

    // --- Customer Feedback DTOs ---
    public class CreateFeedbackDto
    {
        public long UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        public long? PhotographerId { get; set; }

        public long? BookingId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        [Required]
        public string Comment { get; set; } = string.Empty;

        public string ServiceCategory { get; set; } = "General";
    }

    public class PhotographerRatingStatsDto
    {
        public long PhotographerId { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public int FiveStarCount { get; set; }
        public int FourStarCount { get; set; }
        public int ThreeStarCount { get; set; }
        public int TwoStarCount { get; set; }
        public int OneStarCount { get; set; }
    }

    // --- Complaint DTOs ---
    public class CreateComplaintDto
    {
        public long UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string CustomerEmail { get; set; } = string.Empty;

        public long? BookingId { get; set; }

        [Required]
        public string IssueType { get; set; } = "Other"; // Quality, Delay, Behavior, Billing, Cancellation, Other

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Urgency { get; set; } = "Medium"; // Low, Medium, High, Critical
    }

    public class ResolveComplaintDto
    {
        [Required]
        public string Status { get; set; } = "Resolved"; // Resolved, Rejected, UnderInvestigation

        [Required]
        public string ResolutionNotes { get; set; } = string.Empty;
    }
}
