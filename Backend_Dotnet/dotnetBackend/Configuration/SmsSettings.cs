namespace PhotoHub.Api.Configuration
{
    public class SmsSettings
    {
        public string Provider { get; set; } = "Twilio"; // Twilio or Mock
        public string AccountSid { get; set; } = string.Empty;
        public string AuthToken { get; set; } = string.Empty;
        public string FromPhoneNumber { get; set; } = "+18005550199";
        public bool UseMockProvider { get; set; } = true;
    }
}
