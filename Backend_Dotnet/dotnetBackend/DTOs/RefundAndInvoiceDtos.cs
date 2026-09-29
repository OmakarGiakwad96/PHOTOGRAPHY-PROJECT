using System;

namespace PhotoHub.Api.DTOs
{
    public class RefundRequestDto
    {
        public long BookingId { get; set; }
        public long PaymentId { get; set; }
        public long UserId { get; set; }
        public decimal RefundAmount { get; set; }
        public string RefundReason { get; set; } = string.Empty;
    }

    public class ProcessRefundDto
    {
        public long RefundId { get; set; }
        public bool IsApproved { get; set; }
        public long AdminUserId { get; set; }
        public string? AdminNotes { get; set; }
    }

    public class InvoiceDto
    {
        public long InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public long PaymentId { get; set; }
        public long BookingId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string PhotographerName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public decimal BaseAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Paid";
        public DateTime IssuedAt { get; set; }
        public DateTime DueDate { get; set; }
    }
}
