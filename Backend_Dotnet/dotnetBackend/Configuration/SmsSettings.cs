namespace PhotoHub.Api.Configuration
{
    public class SmsSettings
    {
        public string Provider { get; set; } = "MSG91"; // MSG91, Twilio, or Mock
        
        // MSG91 / Indian SMS Configuration
        public string AuthKey { get; set; } = string.Empty;
        public string SenderId { get; set; } = "PHOHUB";
        public string TemplateId { get; set; } = string.Empty; // MSG91 Flow ID / DLT Template ID
        public string EntityId { get; set; } = string.Empty; // Indian DLT Principal Entity (PE) ID
        public string Route { get; set; } = "4"; // 4 for Transactional SMS

        // 2Factor.in Configuration (Instant Indian SMS & OTP)
        public string TwoFactorApiKey { get; set; } = string.Empty;

        // Twilio fallback (if used)
        public string AccountSid { get; set; } = string.Empty;
        public string AuthToken { get; set; } = string.Empty;
        public string FromPhoneNumber { get; set; } = "+18005550199";

        public bool UseMockProvider { get; set; } = true;
    }
}
