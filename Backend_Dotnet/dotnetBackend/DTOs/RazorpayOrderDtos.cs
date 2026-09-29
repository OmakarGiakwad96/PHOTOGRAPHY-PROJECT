namespace PhotoHub.Api.DTOs
{
    public class RazorpayOrderRequestDto
    {
        public long BookingId { get; set; }
        public decimal Amount { get; set; } // Amount in ₹
        public string Currency { get; set; } = "₹";
        public string Receipt { get; set; } = string.Empty;
    }

    public class RazorpayOrderResponseDto
    {
        public string OrderId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "₹";
        public string KeyId { get; set; } = string.Empty;
        public long BookingId { get; set; }
        public string Status { get; set; } = "created";
    }
}
