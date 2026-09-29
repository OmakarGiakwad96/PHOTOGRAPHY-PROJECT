using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Configuration;
using PhotoHub.Api.Data;
using PhotoHub.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Settings Configurations
builder.Services.Configure<RazorpaySettings>(builder.Configuration.GetSection("Razorpay"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.Configure<SmsSettings>(builder.Configuration.GetSection("SMS"));

// Register HttpClient for external API calls
builder.Services.AddHttpClient<IRazorpayService, RazorpayService>();

// Register Infrastructure & Domain Services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IRazorpayService, RazorpayService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IRefundService, RefundService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<ISupportService, SupportService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IComplaintService, ComplaintService>();

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
    ?? "Server=localhost;Port=3306;Database=photohub_db;User=root;Password=your_password;";

builder.Services.AddDbContext<PhotoHubDbContext>(options =>
{
    try
    {
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    }
    catch
    {
        // Fallback MySQL configuration if server auto-detect is deferred at startup
        options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)));
    }
});

var app = builder.Build();

// Automatically ensure database and tables are created on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<PhotoHubDbContext>();
        dbContext.Database.EnsureCreated();
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
