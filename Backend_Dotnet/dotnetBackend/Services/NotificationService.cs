using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Data;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly PhotoHubDbContext _dbContext;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;

        public NotificationService(
            PhotoHubDbContext dbContext,
            IEmailService emailService,
            ISmsService smsService)
        {
            _dbContext = dbContext;
            _emailService = emailService;
            _smsService = smsService;
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
                ErrorMessage = res.ErrorMessage,
                ReferenceId = dto.ReferenceId
            };

            _dbContext.NotificationLogs.Add(log);
            await _dbContext.SaveChangesAsync();

            return log;
        }

        public async Task<NotificationLog> SendSmsNotificationAsync(SmsNotificationRequestDto dto)
        {
            var res = await _smsService.SendSmsAsync(dto.PhoneNumber, dto.Message);

            var log = new NotificationLog
            {
                Recipient = dto.PhoneNumber,
                NotificationType = "SMS",
                EventType = "Custom",
                Subject = null,
                Message = dto.Message,
                Status = res.Status,
                SentAt = DateTime.UtcNow,
                ErrorMessage = res.ErrorMessage,
                ReferenceId = dto.ReferenceId
            };

            _dbContext.NotificationLogs.Add(log);
            await _dbContext.SaveChangesAsync();

            return log;
        }

        public async Task<NotificationResultDto> SendBookingConfirmationAsync(BookingConfirmationRequestDto dto)
        {
            var (subject, htmlBody, smsText) = NotificationTemplateHelper.GenerateBookingConfirmation(dto);
            var result = new NotificationResultDto();

            // 1. Send Email Notification
            if (!string.IsNullOrWhiteSpace(dto.CustomerEmail))
            {
                var emailRes = await _emailService.SendEmailAsync(dto.CustomerEmail, subject, htmlBody, isHtml: true);
                var emailLog = new NotificationLog
                {
                    Recipient = dto.CustomerEmail,
                    NotificationType = "Email",
                    EventType = "BookingConfirmation",
                    Subject = subject,
                    Message = htmlBody,
                    Status = emailRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = emailRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(emailLog);
                result.EmailSent = emailRes.Success;
            }

            // 2. Send SMS Notification (if phone provided)
            if (!string.IsNullOrWhiteSpace(dto.CustomerPhone))
            {
                var smsRes = await _smsService.SendSmsAsync(dto.CustomerPhone, smsText);
                var smsLog = new NotificationLog
                {
                    Recipient = dto.CustomerPhone,
                    NotificationType = "SMS",
                    EventType = "BookingConfirmation",
                    Subject = null,
                    Message = smsText,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();

            result.Success = result.EmailSent || result.SmsSent;
            result.Message = result.Success ? $"Booking confirmation notification sent for Booking #{dto.BookingId}." : "Failed to send notifications.";
            result.NotificationLogIds = await _dbContext.NotificationLogs
                .Where(n => n.ReferenceId == dto.BookingId.ToString() && n.EventType == "BookingConfirmation")
                .Select(n => n.NotificationId)
                .ToListAsync();

            return result;
        }

        public async Task<NotificationResultDto> SendBookingReminderAsync(BookingReminderRequestDto dto)
        {
            var (subject, htmlBody, smsText) = NotificationTemplateHelper.GenerateBookingReminder(dto);
            var result = new NotificationResultDto();

            // 1. Send Email Reminder
            if (!string.IsNullOrWhiteSpace(dto.CustomerEmail))
            {
                var emailRes = await _emailService.SendEmailAsync(dto.CustomerEmail, subject, htmlBody, isHtml: true);
                var emailLog = new NotificationLog
                {
                    Recipient = dto.CustomerEmail,
                    NotificationType = "Email",
                    EventType = "BookingReminder",
                    Subject = subject,
                    Message = htmlBody,
                    Status = emailRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = emailRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(emailLog);
                result.EmailSent = emailRes.Success;
            }

            // 2. Send SMS Reminder
            if (!string.IsNullOrWhiteSpace(dto.CustomerPhone))
            {
                var smsRes = await _smsService.SendSmsAsync(dto.CustomerPhone, smsText);
                var smsLog = new NotificationLog
                {
                    Recipient = dto.CustomerPhone,
                    NotificationType = "SMS",
                    EventType = "BookingReminder",
                    Subject = null,
                    Message = smsText,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();

            result.Success = result.EmailSent || result.SmsSent;
            result.Message = result.Success ? $"Booking reminder notification sent for Booking #{dto.BookingId}." : "Failed to send reminder notifications.";
            result.NotificationLogIds = await _dbContext.NotificationLogs
                .Where(n => n.ReferenceId == dto.BookingId.ToString() && n.EventType == "BookingReminder")
                .Select(n => n.NotificationId)
                .ToListAsync();

            return result;
        }

        public async Task<NotificationResultDto> SendPaymentSuccessNotificationAsync(PaymentSuccessNotificationRequestDto dto)
        {
            var (subject, htmlBody, smsText) = NotificationTemplateHelper.GeneratePaymentSuccess(dto);
            var result = new NotificationResultDto();

            // 1. Send Email Receipt
            if (!string.IsNullOrWhiteSpace(dto.CustomerEmail))
            {
                var emailRes = await _emailService.SendEmailAsync(dto.CustomerEmail, subject, htmlBody, isHtml: true);
                var emailLog = new NotificationLog
                {
                    Recipient = dto.CustomerEmail,
                    NotificationType = "Email",
                    EventType = "PaymentSuccess",
                    Subject = subject,
                    Message = htmlBody,
                    Status = emailRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = emailRes.ErrorMessage,
                    ReferenceId = dto.PaymentId > 0 ? dto.PaymentId.ToString() : dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(emailLog);
                result.EmailSent = emailRes.Success;
            }

            // 2. Send SMS Confirmation
            if (!string.IsNullOrWhiteSpace(dto.CustomerPhone))
            {
                var smsRes = await _smsService.SendSmsAsync(dto.CustomerPhone, smsText);
                var smsLog = new NotificationLog
                {
                    Recipient = dto.CustomerPhone,
                    NotificationType = "SMS",
                    EventType = "PaymentSuccess",
                    Subject = null,
                    Message = smsText,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.PaymentId > 0 ? dto.PaymentId.ToString() : dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();

            result.Success = result.EmailSent || result.SmsSent;
            result.Message = result.Success ? $"Payment success notification sent for Payment #{dto.PaymentId}." : "Failed to send payment success notification.";
            return result;
        }

        public async Task<NotificationResultDto> SendPaymentFailureNotificationAsync(PaymentFailureNotificationRequestDto dto)
        {
            var (subject, htmlBody, smsText) = NotificationTemplateHelper.GeneratePaymentFailure(dto);
            var result = new NotificationResultDto();

            // 1. Send Email Notice
            if (!string.IsNullOrWhiteSpace(dto.CustomerEmail))
            {
                var emailRes = await _emailService.SendEmailAsync(dto.CustomerEmail, subject, htmlBody, isHtml: true);
                var emailLog = new NotificationLog
                {
                    Recipient = dto.CustomerEmail,
                    NotificationType = "Email",
                    EventType = "PaymentFailure",
                    Subject = subject,
                    Message = htmlBody,
                    Status = emailRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = emailRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(emailLog);
                result.EmailSent = emailRes.Success;
            }

            // 2. Send SMS Notice
            if (!string.IsNullOrWhiteSpace(dto.CustomerPhone))
            {
                var smsRes = await _smsService.SendSmsAsync(dto.CustomerPhone, smsText);
                var smsLog = new NotificationLog
                {
                    Recipient = dto.CustomerPhone,
                    NotificationType = "SMS",
                    EventType = "PaymentFailure",
                    Subject = null,
                    Message = smsText,
                    Status = smsRes.Status,
                    SentAt = DateTime.UtcNow,
                    ErrorMessage = smsRes.ErrorMessage,
                    ReferenceId = dto.BookingId.ToString()
                };
                _dbContext.NotificationLogs.Add(smsLog);
                result.SmsSent = smsRes.Success;
            }

            await _dbContext.SaveChangesAsync();

            result.Success = result.EmailSent || result.SmsSent;
            result.Message = result.Success ? $"Payment failure notification sent for Booking #{dto.BookingId}." : "Failed to send payment failure notification.";
            return result;
        }

        public async Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(string? recipient = null, string? eventType = null)
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

            return await query.OrderByDescending(n => n.SentAt).Take(100).ToListAsync();
        }
    }
}
