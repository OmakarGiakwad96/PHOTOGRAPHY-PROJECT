using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface INotificationService
    {
        Task<NotificationLog> SendEmailNotificationAsync(EmailNotificationRequestDto dto);

        Task<NotificationLog> SendSmsNotificationAsync(SmsNotificationRequestDto dto);

        Task<NotificationResultDto> SendBookingConfirmationAsync(BookingConfirmationRequestDto dto);

        Task<NotificationResultDto> SendBookingReminderAsync(BookingReminderRequestDto dto);

        Task<NotificationResultDto> SendPaymentSuccessNotificationAsync(PaymentSuccessNotificationRequestDto dto);

        Task<NotificationResultDto> SendPaymentFailureNotificationAsync(PaymentFailureNotificationRequestDto dto);

        Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(string? recipient = null, string? eventType = null);
    }
}
