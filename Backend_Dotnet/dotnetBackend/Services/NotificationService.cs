using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PhotoHub.Api.Data;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly PhotoHubDbContext _dbContext;
        private readonly IWhatsAppService _whatsAppService;
        private readonly ISmsService _smsService;
        private readonly IEmailService _emailService;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            PhotoHubDbContext dbContext,
            IWhatsAppService whatsAppService,
            ISmsService smsService,
            IEmailService emailService,
            ILogger<NotificationService> logger)
        {
            _dbContext = dbContext;
            _whatsAppService = whatsAppService;
            _smsService = smsService;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<NotificationLog> SendEmailNotificationAsync(EmailNotificationRequestDto dto)
        {
            var res = await _emailService.SendEmailAsync(dto.RecipientEmail, dto.Subject, dto.Body, dto.IsHtml);

            var log = new NotificationLog
            {
                Recipient = dto.RecipientEmail,
                NotificationType = "Email",
                EventType = "Custom",
                Subject = dto.Subject,
                Message = dto.Body,
                Status = res.Status,
                SentAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ErrorMessage = res.ErrorMessage,
                ReferenceId = dto.ReferenceId
            };

            _dbContext.NotificationLogs.Add(log);
            await _dbContext.SaveChangesAsync();

            return log;
        }

        public async Task<NotificationLog> SendSmsNotificationAsync(SmsNotificationRequestDto dto)
        {
            var res = await _smsService.SendSmsAsync(
                dto.PhoneNumber, 
                dto.Message, 
                dto.TemplateId, 
                dto.TemplateVars, 
                dto.IdempotencyKey);

            var log = new NotificationLog
            {
                Recipient = dto.PhoneNumber,
                NotificationType = "SMS",
                EventType = "Custom",
                Subject = null,
                Message = dto.Message,
                TemplateName = dto.TemplateId,
                ProviderMessageId = res.ProviderMessageId,
                Status = res.Status,
                SentAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ErrorMessage = res.ErrorMessage,
                ReferenceId = dto.ReferenceId,
                IdempotencyKey = dto.IdempotencyKey
            };

            _dbContext.NotificationLogs.Add(log);
            await _dbContext.SaveChangesAsync();

            return log;
        }

        public async Task<NotificationLog> SendWhatsAppNotificationAsync(WhatsAppNotificationRequestDto dto)
        {
            var res = await _whatsAppService.SendTemplateMessageAsync(
                dto.PhoneNumber, 
                dto.TemplateName, 
                dto.BodyParameters, 
                dto.IdempotencyKey);

            var log = new NotificationLog
            {
                Recipient = dto.PhoneNumber,
                NotificationType = "WhatsApp",
                EventType = "Custom",
                Subject = null,
                Message = $"Template: {dto.TemplateName} | Params: {string.Join(", ", dto.BodyParameters)}",
                TemplateName = dto.TemplateName,
                ProviderMessageId = res.ProviderMessageId,
                Status = res.Status,
                SentAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ErrorMessage = res.ErrorMessage,
                ReferenceId = dto.ReferenceId,
                IdempotencyKey = dto.IdempotencyKey,
                PayloadJson = JsonSerializer.Serialize(dto.BodyParameters)
            };

            _dbContext.NotificationLogs.Add(log);
            await _dbContext.SaveChangesAsync();

            return log;
        }

        public async Task<NotificationResultDto> SendBookingConfirmationAsync(BookingConfirmationRequestDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GenerateBookingConfirmation(dto);

            var phone = dto.CustomerPhone?.Trim();
            var email = dto.CustomerEmail?.Trim();

            // Check Customer Preferences & Consent
            var pref = await GetPreferenceByPhoneOrEmailAsync(phone, email);
            var allowWhatsApp = pref?.WhatsAppConsent ?? true;
            var allowSms = pref?.SmsConsent ?? true;

            // 1. Dispatch WhatsApp (Primary Channel for rich booking confirmation)
            if (!string.IsNullOrWhiteSpace(phone) && allowWhatsApp)
            {
                var idempotencyKey = $"wa_booking_confirm_{dto.BookingId}";
                var existingLog = await _dbContext.NotificationLogs
                    .FirstOrDefaultAsync(n => n.IdempotencyKey == idempotencyKey);

                if (existingLog == null)
                {
                    try
                    {
                        var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams, idempotencyKey);
                        var waLog = new NotificationLog
                        {
                            Recipient = phone,
                            NotificationType = "WhatsApp",
                            EventType = "BookingConfirmation",
                            Subject = "Booking Confirmation",
                            Message = $"Confirmed booking #{dto.BookingId} with {dto.PhotographerName} on {dto.EventDate:dd MMM yyyy}",
                            TemplateName = waTemplate,
                            ProviderMessageId = waRes.ProviderMessageId,
                            Status = waRes.Status,
                            SentAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            ErrorMessage = waRes.ErrorMessage,
                            ReferenceId = dto.BookingId.ToString(),
                            IdempotencyKey = idempotencyKey,
                            PayloadJson = JsonSerializer.Serialize(waParams)
                        };
                        _dbContext.NotificationLogs.Add(waLog);
                        result.WhatsAppSent = waRes.Success;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to dispatch WhatsApp confirmation for booking #{BookingId}", dto.BookingId);
                    }
                }
                else
                {
                    result.WhatsAppSent = true;
                }
            }

            // 2. Dispatch SMS (Critical Indian DLT SMS with booking ref and short link)
            if (!string.IsNullOrWhiteSpace(phone) && allowSms)
            {
                var idempotencyKey = $"sms_booking_confirm_{dto.BookingId}";
                var existingLog = await _dbContext.NotificationLogs
                    .FirstOrDefaultAsync(n => n.IdempotencyKey == idempotencyKey);

                if (existingLog == null)
                {
                    try
                    {
                        var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars, idempotencyKey);
                        var smsLog = new NotificationLog
                        {
                            Recipient = phone,
                            NotificationType = "SMS",
                            EventType = "BookingConfirmation",
                            Message = smsText,
                            TemplateName = "PH_BOOKING_CONFIRM",
                            ProviderMessageId = smsRes.ProviderMessageId,
                            Status = smsRes.Status,
                            SentAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            ErrorMessage = smsRes.ErrorMessage,
                            ReferenceId = dto.BookingId.ToString(),
                            IdempotencyKey = idempotencyKey,
                            PayloadJson = JsonSerializer.Serialize(smsVars)
                        };
                        _dbContext.NotificationLogs.Add(smsLog);
                        result.SmsSent = smsRes.Success;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to dispatch SMS confirmation for booking #{BookingId}", dto.BookingId);
                    }
                }
                else
                {
                    result.SmsSent = true;
                }
            }

            // 3. Dispatch Email
            if (!string.IsNullOrWhiteSpace(email))
            {
                var idempotencyKey = $"email_booking_confirm_{dto.BookingId}";
                var existingLog = await _dbContext.NotificationLogs
                    .FirstOrDefaultAsync(n => n.IdempotencyKey == idempotencyKey);

                if (existingLog == null)
                {
                    try
                    {
                        var emailRes = await _emailService.SendEmailAsync(email, subject, htmlBody, isHtml: true);
                        var emailLog = new NotificationLog
                        {
                            Recipient = email,
                            NotificationType = "Email",
                            EventType = "BookingConfirmation",
                            Subject = subject,
                            Message = htmlBody,
                            Status = emailRes.Status,
                            SentAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            ErrorMessage = emailRes.ErrorMessage,
                            ReferenceId = dto.BookingId.ToString(),
                            IdempotencyKey = idempotencyKey
                        };
                        _dbContext.NotificationLogs.Add(emailLog);
                        result.EmailSent = emailRes.Success;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to dispatch Email confirmation for booking #{BookingId}", dto.BookingId);
                    }
                }
                else
                {
                    result.EmailSent = true;
                }
            }

            await _dbContext.SaveChangesAsync();

            result.Success = result.WhatsAppSent || result.SmsSent || result.EmailSent;
            result.Message = result.Success
                ? $"Booking confirmation dispatched for Booking #{dto.BookingId} (WhatsApp: {result.WhatsAppSent}, SMS: {result.SmsSent}, Email: {result.EmailSent})."
                : "Failed to dispatch notifications.";

            return result;
        }

        public async Task<NotificationResultDto> SendBookingRequestNotificationAsync(BookingRequestNotificationDto dto)
        {
            var result = new NotificationResultDto();
            var phone = dto.CustomerPhone?.Trim();
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var eventDateStr = dto.EventDate.ToString("dd MMM yyyy");

            if (!string.IsNullOrWhiteSpace(phone))
            {
                var waParams = new List<string>
                {
                    dto.CustomerName,
                    dto.PhotographerName,
                    eventDateStr,
                    bookingRef
                };

                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, "booking_request_received", waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = "BookingRequest",
                    Subject = "Booking Request Received",
                    Message = $"Booking request {bookingRef} received for {dto.PhotographerName} on {eventDateStr}",
                    TemplateName = "booking_request_received",
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                var smsMsg = $"PhotoHub Connect: We have received your booking request {bookingRef} for {dto.PhotographerName} on {eventDateStr}. We will notify you once confirmed.";
                var smsRes = await _smsService.SendSmsAsync(phone, smsMsg);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = "BookingRequest",
                    Message = smsMsg,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent;
            result.Message = result.Success ? $"Booking request notification sent for {bookingRef}" : "Failed to send request notification";
            return result;
        }

        public async Task<NotificationResultDto> SendPaymentSuccessNotificationAsync(PaymentSuccessNotificationRequestDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GeneratePaymentSuccess(dto);

            var phone = dto.CustomerPhone?.Trim();
            var email = dto.CustomerEmail?.Trim();

            // Idempotency: Prevent duplicate payment alerts
            var txnKey = string.IsNullOrWhiteSpace(dto.TransactionId) ? dto.PaymentId.ToString() : dto.TransactionId;

            // 1. WhatsApp Receipt
            if (!string.IsNullOrWhiteSpace(phone))
            {
                var idempotencyKey = $"wa_pay_success_{txnKey}";
                var existing = await _dbContext.NotificationLogs.FirstOrDefaultAsync(n => n.IdempotencyKey == idempotencyKey);
                if (existing == null)
                {
                    var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams, idempotencyKey);
                    var waLog = new NotificationLog
                    {
                        Recipient = phone,
                        NotificationType = "WhatsApp",
                        EventType = "PaymentSuccess",
                        Subject = "Payment Receipt",
                        Message = $"Payment of ₹{dto.Amount:N0} verified for booking #{dto.BookingId}. Txn: {dto.TransactionId}",
                        TemplateName = waTemplate,
                        ProviderMessageId = waRes.ProviderMessageId,
                        Status = waRes.Status,
                        SentAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ErrorMessage = waRes.ErrorMessage,
                        ReferenceId = dto.PaymentId > 0 ? dto.PaymentId.ToString() : dto.BookingId.ToString(),
                        IdempotencyKey = idempotencyKey,
                        PayloadJson = JsonSerializer.Serialize(waParams)
                    };
                    _dbContext.NotificationLogs.Add(waLog);
                    result.WhatsAppSent = waRes.Success;
                }
                else
                {
                    result.WhatsAppSent = true;
                }
            }

            // 2. SMS Alert
            if (!string.IsNullOrWhiteSpace(phone))
            {
                var idempotencyKey = $"sms_pay_success_{txnKey}";
                var existing = await _dbContext.NotificationLogs.FirstOrDefaultAsync(n => n.IdempotencyKey == idempotencyKey);
                if (existing == null)
                {
                    var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars, idempotencyKey);
                    var smsLog = new NotificationLog
                    {
                        Recipient = phone,
                        NotificationType = "SMS",
                        EventType = "PaymentSuccess",
                        Message = smsText,
                        ProviderMessageId = smsRes.ProviderMessageId,
                        Status = smsRes.Status,
                        SentAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ErrorMessage = smsRes.ErrorMessage,
                        ReferenceId = dto.PaymentId > 0 ? dto.PaymentId.ToString() : dto.BookingId.ToString(),
                        IdempotencyKey = idempotencyKey,
                        PayloadJson = JsonSerializer.Serialize(smsVars)
                    };
                    _dbContext.NotificationLogs.Add(smsLog);
                    result.SmsSent = smsRes.Success;
                }
                else
                {
                    result.SmsSent = true;
                }
            }

            // 3. Email Receipt
            if (!string.IsNullOrWhiteSpace(email))
            {
                var idempotencyKey = $"email_pay_success_{txnKey}";
                var existing = await _dbContext.NotificationLogs.FirstOrDefaultAsync(n => n.IdempotencyKey == idempotencyKey);
                if (existing == null)
                {
                    var emailRes = await _emailService.SendEmailAsync(email, subject, htmlBody, isHtml: true);
                    var emailLog = new NotificationLog
                    {
                        Recipient = email,
                        NotificationType = "Email",
                        EventType = "PaymentSuccess",
                        Subject = subject,
                        Message = htmlBody,
                        Status = emailRes.Status,
                        SentAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ErrorMessage = emailRes.ErrorMessage,
                        ReferenceId = dto.PaymentId > 0 ? dto.PaymentId.ToString() : dto.BookingId.ToString(),
                        IdempotencyKey = idempotencyKey
                    };
                    _dbContext.NotificationLogs.Add(emailLog);
                    result.EmailSent = emailRes.Success;
                }
                else
                {
                    result.EmailSent = true;
                }
            }

            await _dbContext.SaveChangesAsync();

            result.Success = result.WhatsAppSent || result.SmsSent || result.EmailSent;
            result.Message = result.Success
                ? $"Payment receipt dispatched for Payment #{dto.PaymentId} (WhatsApp: {result.WhatsAppSent}, SMS: {result.SmsSent})."
                : "Failed to dispatch payment notifications.";

            return result;
        }

        public async Task<NotificationResultDto> SendPaymentFailureNotificationAsync(PaymentFailureNotificationRequestDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GeneratePaymentFailure(dto);

            var phone = dto.CustomerPhone?.Trim();
            var email = dto.CustomerEmail?.Trim();

            if (!string.IsNullOrWhiteSpace(phone))
            {
                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = "PaymentFailure",
                    Subject = "Payment Alert",
                    Message = $"Payment of ₹{dto.Amount:N0} failed for booking #{dto.BookingId}. Reason: {dto.FailureReason}",
                    TemplateName = waTemplate,
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = "PaymentFailure",
                    Message = smsText,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                var emailRes = await _emailService.SendEmailAsync(email, subject, htmlBody, isHtml: true);
                var emailLog = new NotificationLog
                {
                    Recipient = email,
                    NotificationType = "Email",
                    EventType = "PaymentFailure",
                    Subject = subject,
                    Message = htmlBody,
                    Status = emailRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = emailRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(emailLog);
                result.EmailSent = emailRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent || result.EmailSent;
            result.Message = result.Success ? $"Payment failure alert sent for booking #{dto.BookingId}" : "Failed to send alert";
            return result;
        }

        public async Task<NotificationResultDto> SendPhotographerStatusNotificationAsync(PhotographerStatusNotificationDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GeneratePhotographerStatus(dto);

            var phone = dto.CustomerPhone?.Trim();

            if (!string.IsNullOrWhiteSpace(phone))
            {
                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = dto.Status == "Accepted" ? "PhotographerAccepted" : "PhotographerRejected",
                    Subject = $"Photographer {dto.Status}",
                    Message = $"{dto.PhotographerName} has {dto.Status.ToLower()} your booking #{dto.BookingId}",
                    TemplateName = waTemplate,
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = dto.Status == "Accepted" ? "PhotographerAccepted" : "PhotographerRejected",
                    Message = smsText,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent;
            result.Message = result.Success ? $"Photographer status update sent for booking #{dto.BookingId}" : "Failed to send update";
            return result;
        }

        public async Task<NotificationResultDto> SendBookingCancellationNotificationAsync(BookingCancellationNotificationDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GenerateBookingCancellation(dto);

            var phone = dto.CustomerPhone?.Trim();

            if (!string.IsNullOrWhiteSpace(phone))
            {
                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = "BookingCancelled",
                    Subject = "Booking Cancelled",
                    Message = $"Booking #{dto.BookingId} has been cancelled. Refund: ₹{dto.RefundAmount:N0}",
                    TemplateName = waTemplate,
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = "BookingCancelled",
                    Message = smsText,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent;
            result.Message = result.Success ? $"Cancellation notification sent for booking #{dto.BookingId}" : "Failed to send cancellation";
            return result;
        }

        public async Task<NotificationResultDto> SendRefundStatusNotificationAsync(RefundStatusNotificationDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GenerateRefundStatus(dto);

            var phone = dto.CustomerPhone?.Trim();

            if (!string.IsNullOrWhiteSpace(phone))
            {
                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = "RefundStatus",
                    Subject = "Refund Update",
                    Message = $"Refund of ₹{dto.Amount:N0} is {dto.RefundStatus} for booking #{dto.BookingId}",
                    TemplateName = waTemplate,
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage,
                    ReferenceId = dto.RefundId.ToString()
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = "RefundStatus",
                    Message = smsText,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.RefundId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent;
            result.Message = result.Success ? $"Refund update dispatched for Refund #{dto.RefundId}" : "Failed to send refund update";
            return result;
        }

        public async Task<NotificationResultDto> SendBookingReminderAsync(BookingReminderRequestDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GenerateBookingReminder(dto);

            var phone = dto.CustomerPhone?.Trim();
            var email = dto.CustomerEmail?.Trim();

            if (!string.IsNullOrWhiteSpace(phone))
            {
                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = "BookingReminder",
                    Subject = "Photoshoot Reminder",
                    Message = $"Reminder: shoot with {dto.PhotographerName} on {dto.EventDate:dd MMM yyyy} at {dto.Location}",
                    TemplateName = waTemplate,
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = "BookingReminder",
                    Message = smsText,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                var emailRes = await _emailService.SendEmailAsync(email, subject, htmlBody, isHtml: true);
                var emailLog = new NotificationLog
                {
                    Recipient = email,
                    NotificationType = "Email",
                    EventType = "BookingReminder",
                    Subject = subject,
                    Message = htmlBody,
                    Status = emailRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = emailRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(emailLog);
                result.EmailSent = emailRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent || result.EmailSent;
            result.Message = result.Success ? $"Reminder sent for booking #{dto.BookingId}" : "Failed to send reminder";
            return result;
        }

        public async Task<NotificationResultDto> SendOtpVerificationAsync(OtpVerificationNotificationDto dto)
        {
            var result = new NotificationResultDto();
            var (waTemplate, waParams, smsText, smsVars, subject, htmlBody) =
                NotificationTemplateHelper.GenerateOtp(dto);

            var phone = dto.PhoneNumber?.Trim();

            if (!string.IsNullOrWhiteSpace(phone))
            {
                // Send WhatsApp OTP
                var waRes = await _whatsAppService.SendTemplateMessageAsync(phone, waTemplate, waParams);
                var waLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "WhatsApp",
                    EventType = "OtpVerification",
                    Subject = "Verification Code",
                    Message = $"Verification code: {dto.OtpCode}. Valid for {dto.ExpiryMinutes} minutes.",
                    TemplateName = waTemplate,
                    ProviderMessageId = waRes.ProviderMessageId,
                    Status = waRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = waRes.ErrorMessage
                };
                _dbContext.NotificationLogs.Add(waLog);
                result.WhatsAppSent = waRes.Success;

                // Send SMS OTP
                var smsRes = await _smsService.SendSmsAsync(phone, smsText, null, smsVars);
                var smsLog = new NotificationLog
                {
                    Recipient = phone,
                    NotificationType = "SMS",
                    EventType = "OtpVerification",
                    Message = smsText,
                    ProviderMessageId = smsRes.ProviderMessageId,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();
            result.Success = result.WhatsAppSent || result.SmsSent;
            result.Message = result.Success ? "OTP dispatched successfully" : "Failed to dispatch OTP";
            return result;
        }

        public async Task<NotificationResultDto> SendBroadcastNotificationAsync(BroadcastNotificationDto dto)
        {
            var result = new NotificationResultDto();

            // Fetch target recipient phones and emails based on audience
            var targetPreferences = await _dbContext.NotificationPreferences
                .Where(p => p.PromotionalConsent)
                .Take(50)
                .ToListAsync();

            if (!targetPreferences.Any())
            {
                // Fallback to sample phone numbers if no active database preferences
                targetPreferences.Add(new NotificationPreference
                {
                    PhoneNumber = "919876543210",
                    Email = "admin@photohubconnect.store",
                    PromotionalConsent = true
                });
            }

            int count = 0;
            foreach (var p in targetPreferences)
            {
                if (dto.Channels.Contains("WhatsApp") && !string.IsNullOrWhiteSpace(p.PhoneNumber))
                {
                    var waRes = await _whatsAppService.SendTemplateMessageAsync(
                        p.PhoneNumber, 
                        "promotional_broadcast", 
                        new List<string> { p.PhoneNumber, dto.Title, dto.Message });

                    _dbContext.NotificationLogs.Add(new NotificationLog
                    {
                        Recipient = p.PhoneNumber,
                        NotificationType = "WhatsApp",
                        EventType = "Custom",
                        Subject = dto.Title,
                        Message = dto.Message,
                        ProviderMessageId = waRes.ProviderMessageId,
                        Status = waRes.Status,
                        SentAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ErrorMessage = waRes.ErrorMessage
                    });
                    result.WhatsAppSent = true;
                    count++;
                }

                if (dto.Channels.Contains("SMS") && !string.IsNullOrWhiteSpace(p.PhoneNumber))
                {
                    var smsRes = await _smsService.SendSmsAsync(p.PhoneNumber, $"PhotoHub: {dto.Title} - {dto.Message}");
                    _dbContext.NotificationLogs.Add(new NotificationLog
                    {
                        Recipient = p.PhoneNumber,
                        NotificationType = "SMS",
                        EventType = "Custom",
                        Subject = dto.Title,
                        Message = dto.Message,
                        ProviderMessageId = smsRes.ProviderMessageId,
                        Status = smsRes.Status,
                        SentAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ErrorMessage = smsRes.ErrorMessage
                    });
                    result.SmsSent = true;
                    count++;
                }
            }

            await _dbContext.SaveChangesAsync();
            result.Success = count > 0;
            result.Message = $"Broadcast processed to {count} recipient channel instances.";
            return result;
        }

        public async Task<bool> RetryFailedNotificationAsync(long notificationId)
        {
            var log = await _dbContext.NotificationLogs.FindAsync(notificationId);
            if (log == null) return false;

            log.RetryCount++;
            log.UpdatedAt = DateTime.UtcNow;

            if (log.NotificationType == "WhatsApp")
            {
                List<string> parameters = new();
                if (!string.IsNullOrEmpty(log.PayloadJson))
                {
                    try { parameters = JsonSerializer.Deserialize<List<string>>(log.PayloadJson) ?? new(); }
                    catch { parameters.Add(log.Message); }
                }
                else
                {
                    parameters.Add(log.Message);
                }

                var waRes = await _whatsAppService.SendTemplateMessageAsync(
                    log.Recipient,
                    log.TemplateName ?? "booking_confirmed",
                    parameters,
                    $"retry_{log.NotificationId}_{DateTime.UtcNow.Ticks}");

                log.Status = waRes.Status;
                log.ProviderMessageId = waRes.ProviderMessageId ?? log.ProviderMessageId;
                log.ErrorMessage = waRes.ErrorMessage;
            }
            else if (log.NotificationType == "SMS")
            {
                var smsRes = await _smsService.SendSmsAsync(
                    log.Recipient,
                    log.Message,
                    log.TemplateName,
                    null,
                    $"retry_{log.NotificationId}_{DateTime.UtcNow.Ticks}");

                log.Status = smsRes.Status;
                log.ProviderMessageId = smsRes.ProviderMessageId ?? log.ProviderMessageId;
                log.ErrorMessage = smsRes.ErrorMessage;
            }
            else if (log.NotificationType == "Email")
            {
                var emailRes = await _emailService.SendEmailAsync(
                    log.Recipient,
                    log.Subject ?? "Notification",
                    log.Message,
                    isHtml: true);

                log.Status = emailRes.Status;
                log.ErrorMessage = emailRes.ErrorMessage;
            }

            await _dbContext.SaveChangesAsync();
            return log.Status != "Failed";
        }

        public async Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(
            string? recipient = null, 
            string? eventType = null, 
            string? channel = null, 
            string? status = null)
        {
            var query = _dbContext.NotificationLogs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(recipient))
            {
                query = query.Where(n => n.Recipient.Contains(recipient));
            }

            if (!string.IsNullOrWhiteSpace(eventType))
            {
                query = query.Where(n => n.EventType == eventType);
            }

            if (!string.IsNullOrWhiteSpace(channel))
            {
                query = query.Where(n => n.NotificationType.ToLower() == channel.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(n => n.Status.ToLower() == status.ToLower());
            }

            return await query.OrderByDescending(n => n.SentAt).Take(150).ToListAsync();
        }

        public async Task<NotificationStatsDto> GetNotificationStatsAsync()
        {
            var all = await _dbContext.NotificationLogs.ToListAsync();
            var total = all.Count;
            var delivered = all.Count(n => n.Status == "Delivered" || n.Status == "Read");
            var sent = all.Count(n => n.Status == "Sent" || n.Status == "Accepted" || n.Status == "Simulated");
            var pending = all.Count(n => n.Status == "Pending" || n.Status == "Queued");
            var failed = all.Count(n => n.Status == "Failed");

            var waCount = all.Count(n => n.NotificationType == "WhatsApp");
            var smsCount = all.Count(n => n.NotificationType == "SMS");
            var emailCount = all.Count(n => n.NotificationType == "Email");

            var deliveryRate = (total > 0) ? Math.Round((double)(delivered + sent) / total * 100, 1) : 100.0;

            return new NotificationStatsDto
            {
                TotalNotifications = total,
                DeliveredCount = delivered,
                SentCount = sent,
                PendingCount = pending,
                FailedCount = failed,
                WhatsAppCount = waCount,
                SmsCount = smsCount,
                EmailCount = emailCount,
                DeliveryRate = deliveryRate
            };
        }

        public async Task<NotificationPreference?> GetNotificationPreferencesAsync(long userId)
        {
            return await _dbContext.NotificationPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<NotificationPreference> SaveNotificationPreferencesAsync(NotificationPreferenceDto dto)
        {
            NotificationPreference? pref = null;

            if (dto.UserId.HasValue && dto.UserId.Value > 0)
            {
                pref = await _dbContext.NotificationPreferences.FirstOrDefaultAsync(p => p.UserId == dto.UserId.Value);
            }

            if (pref == null && !string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                pref = await _dbContext.NotificationPreferences.FirstOrDefaultAsync(p => p.PhoneNumber == dto.PhoneNumber);
            }

            if (pref == null)
            {
                pref = new NotificationPreference
                {
                    UserId = dto.UserId,
                    PhoneNumber = dto.PhoneNumber,
                    Email = dto.Email,
                    WhatsAppConsent = dto.WhatsAppConsent,
                    SmsConsent = dto.SmsConsent,
                    EmailConsent = dto.EmailConsent,
                    PromotionalConsent = dto.PromotionalConsent,
                    ConsentSource = dto.ConsentSource ?? "Settings",
                    ConsentTimestamp = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _dbContext.NotificationPreferences.Add(pref);
            }
            else
            {
                pref.PhoneNumber = dto.PhoneNumber;
                if (!string.IsNullOrWhiteSpace(dto.Email)) pref.Email = dto.Email;
                pref.WhatsAppConsent = dto.WhatsAppConsent;
                pref.SmsConsent = dto.SmsConsent;
                pref.EmailConsent = dto.EmailConsent;
                pref.PromotionalConsent = dto.PromotionalConsent;
                pref.UpdatedAt = DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync();
            return pref;
        }

        private async Task<NotificationPreference?> GetPreferenceByPhoneOrEmailAsync(string? phone, string? email)
        {
            if (!string.IsNullOrWhiteSpace(phone))
            {
                var pref = await _dbContext.NotificationPreferences
                    .FirstOrDefaultAsync(p => p.PhoneNumber == phone);
                if (pref != null) return pref;
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                var pref = await _dbContext.NotificationPreferences
                    .FirstOrDefaultAsync(p => p.Email == email);
                if (pref != null) return pref;
            }

            return null;
        }
    }
}
