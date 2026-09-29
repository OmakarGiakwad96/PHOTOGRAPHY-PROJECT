namespace PhotoHub.Api.Configuration
{
    public class RazorpaySettings
    {
        public string KeyId { get; set; } = "rzp_test_mockKey123456";
        public string KeySecret { get; set; } = "mockSecretKey7890123456";
        public string WebhookSecret { get; set; } = "mockWebhookSecretKey";
        public string Currency { get; set; } = "₹";
    }
}
