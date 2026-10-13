namespace PhotoHub.Api.Configuration
{
    public class WhatsAppSettings
    {
        public string PhoneNumberId { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string BusinessAccountId { get; set; } = string.Empty;
        public string ApiVersion { get; set; } = "v20.0";
        public string VerifyToken { get; set; } = "photohub_wa_verify_token_2026";
        public string AppSecret { get; set; } = string.Empty;
        public bool UseMockProvider { get; set; } = true;
    }
}
