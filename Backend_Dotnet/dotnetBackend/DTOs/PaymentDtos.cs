using System;

namespace PhotoHub.Api.DTOs
{
    public class ProcessPaymentDto
    {
        public long BookingId { get; set; }
        public long UserId { get; set; }
        public long PhotographerId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "INR";
        public string PaymentMethod { get; set; } = "Razorpay"; // Razorpay, Credit Card, UPI, NetBanking
        public string PaymentGateway { get; set; } = "Razorpay";
        
        // Razorpay Specific verification fields
        public string? RazorpayOrderId { get; set; }
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpaySignature { get; set; }
    }

    public class PaymentResponseDto
    {
        public long PaymentId { get; set; }
        public long BookingId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "₹";
        public string PaymentMethod { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime PaidAt { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? RazorpayPaymentId { get; set; }
    }
}
