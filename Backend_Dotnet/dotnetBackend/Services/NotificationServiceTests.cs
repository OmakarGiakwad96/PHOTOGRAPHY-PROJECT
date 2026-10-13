using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using PhotoHub.Api.Configuration;
using PhotoHub.Api.Data;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;
using Xunit;

namespace PhotoHub.Api.Services
{
    public class NotificationServiceTests
    {
        private PhotoHubDbContext GetInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<PhotoHubDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            return new PhotoHubDbContext(options);
        }

        private (NotificationService Service, WhatsAppService WhatsApp, SmsService Sms, PhotoHubDbContext Db) CreateTestSetup(string dbName)
        {
            var db = GetInMemoryDbContext(dbName);

            var waOptions = Options.Create(new WhatsAppSettings
            {
                PhoneNumberId = "1234567890",
                AccessToken = "mock_access_token",
                VerifyToken = "test_verify_token",
                AppSecret = "test_app_secret",
                UseMockProvider = true
            });

            var smsOptions = Options.Create(new SmsSettings
            {
                Provider = "MSG91",
                AuthKey = "mock_auth_key",
                SenderId = "PHOHUB",
                TemplateId = "mock_flow_id",
                UseMockProvider = true
            });

            var emailOptions = Options.Create(new EmailSettings
            {
                UseMockProvider = true
            });

            var httpClient = new System.Net.Http.HttpClient();
            var waService = new WhatsAppService(waOptions, httpClient, db, NullLogger<WhatsAppService>.Instance);
            var smsService = new SmsService(smsOptions, httpClient, db, NullLogger<SmsService>.Instance);
            var emailService = new EmailService(emailOptions, NullLogger<EmailService>.Instance);

            var notifService = new NotificationService(
                db, 
                waService, 
                smsService, 
                emailService, 
                NullLogger<NotificationService>.Instance);

            return (notifService, waService, smsService, db);
        }

        [Fact]
        public async Task SendBookingConfirmation_DispatchesWhatsAppAndSms_CreatesAuditLogs()
        {
            var (service, _, _, db) = CreateTestSetup("Test_BookingConfirm");

            var dto = new BookingConfirmationRequestDto
            {
                BookingId = 1001,
                CustomerName = "Pooja Sharma",
                CustomerEmail = "pooja@example.com",
                CustomerPhone = "+919876543210",
                PhotographerName = "Arjun Lensworks",
                EventDate = DateTime.UtcNow.AddDays(5),
                Amount = 35000,
                PackageName = "Wedding Royale"
            };

            var result = await service.SendBookingConfirmationAsync(dto);

            Assert.True(result.Success);
            Assert.True(result.WhatsAppSent);
            Assert.True(result.SmsSent);

            var logs = await db.NotificationLogs.Where(l => l.ReferenceId == "1001").ToListAsync();
            Assert.True(logs.Count >= 2);
            Assert.Contains(logs, l => l.NotificationType == "WhatsApp" && l.EventType == "BookingConfirmation");
            Assert.Contains(logs, l => l.NotificationType == "SMS" && l.EventType == "BookingConfirmation");
        }

        [Fact]
        public async Task SendPaymentSuccess_EnforcesIdempotency_PreventsDuplicateSends()
        {
            var (service, _, _, db) = CreateTestSetup("Test_Idempotency");

            var dto = new PaymentSuccessNotificationRequestDto
            {
                PaymentId = 501,
                BookingId = 2002,
                CustomerName = "Kunal Verma",
                CustomerEmail = "kunal@example.com",
                CustomerPhone = "9876501234",
                Amount = 15000,
                TransactionId = "pay_test_txn_duplicate_check",
                PaymentMethod = "Razorpay Standard"
            };

            // First send
            var result1 = await service.SendPaymentSuccessNotificationAsync(dto);
            Assert.True(result1.Success);

            var initialCount = await db.NotificationLogs.CountAsync(l => l.EventType == "PaymentSuccess");

            // Second send with same transaction ID
            var result2 = await service.SendPaymentSuccessNotificationAsync(dto);
            Assert.True(result2.Success);

            var secondCount = await db.NotificationLogs.CountAsync(l => l.EventType == "PaymentSuccess");

            // Count should remain unchanged due to idempotency protection
            Assert.Equal(initialCount, secondCount);
        }

        [Fact]
        public async Task CustomerPreference_OptOutWhatsApp_SuppressesWhatsAppChannel()
        {
            var (service, _, _, db) = CreateTestSetup("Test_CustomerOptOut");

            // Save customer preference with WhatsApp turned off
            await service.SaveNotificationPreferencesAsync(new NotificationPreferenceDto
            {
                PhoneNumber = "919988776655",
                WhatsAppConsent = false,
                SmsConsent = true,
                EmailConsent = true,
                ConsentSource = "Settings"
            });

            var dto = new BookingConfirmationRequestDto
            {
                BookingId = 3003,
                CustomerName = "Rohan Mehta",
                CustomerEmail = "rohan@example.com",
                CustomerPhone = "919988776655",
                PhotographerName = "Studio Pixel",
                EventDate = DateTime.UtcNow.AddDays(10),
                Amount = 20000
            };

            var result = await service.SendBookingConfirmationAsync(dto);

            Assert.True(result.Success);
            Assert.False(result.WhatsAppSent); // WhatsApp should be suppressed
            Assert.True(result.SmsSent);      // SMS should still be sent
        }

        [Fact]
        public async Task WhatsAppService_VerifyWebhookSignature_ValidatesCorrectly()
        {
            var (_, waService, _, _) = CreateTestSetup("Test_WaWebhookSig");

            var rawBody = "{\"test\":\"meta_webhook\"}";
            using var hmac = new System.Security.Cryptography.HMACSHA256(System.Text.Encoding.UTF8.GetBytes("test_app_secret"));
            var hash = Convert.ToHexString(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(rawBody))).ToLowerInvariant();
            var header = $"sha256={hash}";

            var isValid = waService.VerifyWebhookSignature(rawBody, header);
            Assert.True(isValid);

            var isInvalid = waService.VerifyWebhookSignature(rawBody, "sha256=invalid_hash_string");
            Assert.False(isInvalid);
        }

        [Fact]
        public async Task WhatsAppService_ProcessDeliveryWebhook_UpdatesStatusToDelivered()
        {
            var (_, waService, _, db) = CreateTestSetup("Test_WaDelivery");

            var messageId = "wamid.HBgLMjAyNjEyM0FCQ0Q";

            // Add an accepted notification log
            var log = new NotificationLog
            {
                Recipient = "919876543210",
                NotificationType = "WhatsApp",
                EventType = "BookingConfirmation",
                Status = "Accepted",
                ProviderMessageId = messageId,
                Message = "Test message",
                SentAt = DateTime.UtcNow
            };
            db.NotificationLogs.Add(log);
            await db.SaveChangesAsync();

            // Simulate Meta WhatsApp delivery webhook JSON
            var webhookJson = $@"{{
                ""object"": ""whatsapp_business_account"",
                ""entry"": [{{
                    ""id"": ""12345"",
                    ""changes"": [{{
                        ""value"": {{
                            ""messaging_product"": ""whatsapp"",
                            ""statuses"": [{{
                                ""id"": ""{messageId}"",
                                ""status"": ""delivered"",
                                ""timestamp"": ""1728860000""
                            }}]
                        }}
                    }}]
                }}]
            }}";

            var processed = await waService.ProcessDeliveryWebhookAsync(webhookJson);
            Assert.True(processed);

            var updatedLog = await db.NotificationLogs.FirstAsync(l => l.ProviderMessageId == messageId);
            Assert.Equal("Delivered", updatedLog.Status);
            Assert.NotNull(updatedLog.DeliveredAt);
        }
    }
}
