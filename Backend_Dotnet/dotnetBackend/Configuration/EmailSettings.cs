namespace PhotoHub.Api.Configuration
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;
        public string SmtpUsername { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
        public string FromEmail { get; set; } = "noreply@photohub.com";
        public string FromName { get; set; } = "PhotoHub Notifications";
        public bool EnableSsl { get; set; } = true;
        public bool UseMockProvider { get; set; } = true;
    }
}
