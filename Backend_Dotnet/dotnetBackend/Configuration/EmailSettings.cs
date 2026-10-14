namespace PhotoHub.Api.Configuration
{
    public class EmailSettings
    {
        public string Provider { get; set; } = "Resend"; // "Resend" or "SMTP"
        public string ResendApiKey { get; set; } = string.Empty;
        public string SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        public string SmtpUsername { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
        public string FromEmail { get; set; } = "noreply@photohubconnect.store";
        public string FromName { get; set; } = "PhotoHub Connect";
        public bool EnableSsl { get; set; } = true;
        public bool UseMockProvider { get; set; } = true;
    }
}
