using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Configuration;
using PhotoHub.Api.Data;
using PhotoHub.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Settings Configurations
builder.Services.Configure<RazorpaySettings>(builder.Configuration.GetSection("Razorpay"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.Configure<SmsSettings>(builder.Configuration.GetSection("SMS"));
builder.Services.Configure<WhatsAppSettings>(builder.Configuration.GetSection("WhatsApp"));

// Register HttpClient for external API calls
builder.Services.AddHttpClient<IRazorpayService, RazorpayService>();
builder.Services.AddHttpClient<IWhatsAppService, WhatsAppService>();
builder.Services.AddHttpClient<ISmsService, SmsService>();

// Register Infrastructure & Domain Services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddScoped<IWhatsAppService, WhatsAppService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IRazorpayService, RazorpayService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IRefundService, RefundService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<ISupportService, SupportService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IComplaintService, ComplaintService>();

// Register Durable Outbox Background Worker for Retries
builder.Services.AddHostedService<NotificationOutboxProcessor>();

// Add Controllers & Swagger with XML Documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "PhotoHub API - Backend Services",
        Version = "v1",
        Description = "REST API documentation for PhotoHub backend services including Payments, Invoices, Notifications, Support Tickets, Customer Feedback, and Complaint Management."
    });

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (System.IO.File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// Configure CORS for Frontend (Vercel deployment + local development)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Configure Entity Framework Core with MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=shinkansen.proxy.rlwy.net;Port=59922;Database=railway;User=root;Password=HxNTrWrUmTXPuBFlaQYTRLjTBUQhhcHk;";

builder.Services.AddDbContext<PhotoHubDbContext>(options =>
{
    // Use a fixed MySQL version to avoid ServerVersion.AutoDetect network calls
    // that can cause startup timeouts on serverless platforms like Vercel
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)));
});

var app = builder.Build();

// Automatically ensure database and tables are created on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<PhotoHubDbContext>();
        dbContext.Database.EnsureCreated();

        // Ensure NotificationLogs table exists on shared MySQL database
        dbContext.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `NotificationLogs` (
                `NotificationId` BIGINT NOT NULL AUTO_INCREMENT,
                `Recipient` VARCHAR(150) NOT NULL,
                `NotificationType` VARCHAR(20) NOT NULL DEFAULT 'WhatsApp',
                `EventType` VARCHAR(50) NOT NULL DEFAULT 'General',
                `Subject` VARCHAR(255) NULL,
                `Message` TEXT NOT NULL,
                `TemplateName` VARCHAR(100) NULL,
                `ProviderMessageId` VARCHAR(150) NULL,
                `Status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
                `RetryCount` INT NOT NULL DEFAULT 0,
                `MaxRetries` INT NOT NULL DEFAULT 3,
                `NextRetryAt` DATETIME NULL,
                `SentAt` DATETIME NOT NULL,
                `DeliveredAt` DATETIME NULL,
                `UpdatedAt` DATETIME NOT NULL,
                `ErrorMessage` VARCHAR(1000) NULL,
                `ReferenceId` VARCHAR(100) NULL,
                `IdempotencyKey` VARCHAR(150) NULL,
                `PayloadJson` TEXT NULL,
                PRIMARY KEY (`NotificationId`),
                INDEX `IX_NotificationLogs_Recipient` (`Recipient`),
                INDEX `IX_NotificationLogs_EventType` (`EventType`),
                INDEX `IX_NotificationLogs_ProviderMessageId` (`ProviderMessageId`),
                INDEX `IX_NotificationLogs_IdempotencyKey` (`IdempotencyKey`),
                INDEX `IX_NotificationLogs_Status` (`Status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `NotificationPreferences` (
                `Id` BIGINT NOT NULL AUTO_INCREMENT,
                `UserId` BIGINT NULL,
                `PhoneNumber` VARCHAR(30) NOT NULL,
                `Email` VARCHAR(150) NULL,
                `WhatsAppConsent` TINYINT(1) NOT NULL DEFAULT 1,
                `SmsConsent` TINYINT(1) NOT NULL DEFAULT 1,
                `EmailConsent` TINYINT(1) NOT NULL DEFAULT 1,
                `PromotionalConsent` TINYINT(1) NOT NULL DEFAULT 0,
                `ConsentSource` VARCHAR(50) NOT NULL DEFAULT 'Checkout',
                `ConsentIpAddress` VARCHAR(50) NULL,
                `ConsentTimestamp` DATETIME NOT NULL,
                `UpdatedAt` DATETIME NOT NULL,
                PRIMARY KEY (`Id`),
                INDEX `IX_NotificationPreferences_PhoneNumber` (`PhoneNumber`),
                INDEX `IX_NotificationPreferences_UserId` (`UserId`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Auto DB creation notice: {ex.Message}");
    }
}

// Enable Swagger & Swagger UI unconditionally (for Development and Production testing)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PhotoHub API v1");
    c.RoutePrefix = "swagger";
});

// Redirect root URL / to /swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
