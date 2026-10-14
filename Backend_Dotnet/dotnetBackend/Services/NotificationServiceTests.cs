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

        [Fact]
        public async Task InAppNotifications_CreateAndRetrieve_CalculatesUnreadCountCorrectly()
        {
            var (notifService, _, _, db) = CreateTestSetup("Test_InAppCount");

            long userId = 777;

            // 1. Create two unread notifications
            await notifService.CreateInAppNotificationAsync(userId, "Client", "Booking Request Sent", "Your request is under review.", "Booking");
            await notifService.CreateInAppNotificationAsync(userId, "Client", "Payment Received", "Amount ₹15,000 recorded.", "Payment");

            var count = await notifService.GetUnreadInAppNotificationCountAsync(userId);
            Assert.Equal(2, count);

            var list = (await notifService.GetUserInAppNotificationsAsync(userId)).ToList();
            Assert.Equal(2, list.Count);
            Assert.All(list, n => Assert.False(n.IsRead));
        }

        [Fact]
        public async Task InAppNotifications_MarkSingleRead_UpdatesStatusAndDecrementsCount()
        {
            var (notifService, _, _, db) = CreateTestSetup("Test_InAppMarkSingle");

            long userId = 888;
            var item1 = await notifService.CreateInAppNotificationAsync(userId, "Client", "Alert 1", "Msg 1", "System");
            var item2 = await notifService.CreateInAppNotificationAsync(userId, "Client", "Alert 2", "Msg 2", "System");

            var marked = await notifService.MarkInAppNotificationAsReadAsync(item1.NotificationId, userId);
            Assert.True(marked);

            var unreadCount = await notifService.GetUnreadInAppNotificationCountAsync(userId);
            Assert.Equal(1, unreadCount);

            var updated1 = await db.InAppNotifications.FindAsync(item1.NotificationId);
            Assert.True(updated1?.IsRead);
            Assert.NotNull(updated1?.ReadAt);
        }

        [Fact]
        public async Task InAppNotifications_MarkAllRead_ClearsAllUnreadForUser()
        {
            var (notifService, _, _, db) = CreateTestSetup("Test_InAppMarkAll");

            long userId = 999;
            await notifService.CreateInAppNotificationAsync(userId, "Client", "Item A", "Msg A", "System");
            await notifService.CreateInAppNotificationAsync(userId, "Client", "Item B", "Msg B", "System");
            await notifService.CreateInAppNotificationAsync(userId, "Client", "Item C", "Msg C", "System");

            var countBefore = await notifService.GetUnreadInAppNotificationCountAsync(userId);
            Assert.Equal(3, countBefore);

            var success = await notifService.MarkAllInAppNotificationsAsReadAsync(userId);
            Assert.True(success);

            var countAfter = await notifService.GetUnreadInAppNotificationCountAsync(userId);
            Assert.Equal(0, countAfter);
        }

        [Fact]
        public async Task SendOtpVerificationAsync_WithValidPhone_DispatchesSuccessfully()
        {
            var (notifService, _, _, db) = CreateTestSetup("Test_SendOtp");

            var dto = new OtpVerificationNotificationDto
            {
                PhoneNumber = "+91 98765 43210",
                OtpCode = "458921",
                ExpiryMinutes = 10,
                Channel = "SMS"
            };

            var result = await notifService.SendOtpVerificationAsync(dto);
            Assert.True(result.Success);
            Assert.True(result.SmsSent);

            var smsLog = await db.NotificationLogs.FirstOrDefaultAsync(l => l.Recipient.Contains("98765") && l.NotificationType == "SMS");
            Assert.NotNull(smsLog);
            Assert.Equal("OtpVerification", smsLog.EventType);
        }
    }
}
