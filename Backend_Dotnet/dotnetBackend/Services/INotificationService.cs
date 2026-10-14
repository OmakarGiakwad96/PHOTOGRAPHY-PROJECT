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

        Task<NotificationLog> SendWhatsAppNotificationAsync(WhatsAppNotificationRequestDto dto);

        Task<NotificationResultDto> SendBookingConfirmationAsync(BookingConfirmationRequestDto dto);

        Task<NotificationResultDto> SendBookingRequestNotificationAsync(BookingRequestNotificationDto dto);

        Task<NotificationResultDto> SendPaymentSuccessNotificationAsync(PaymentSuccessNotificationRequestDto dto);

        Task<NotificationResultDto> SendPaymentFailureNotificationAsync(PaymentFailureNotificationRequestDto dto);

        Task<NotificationResultDto> SendPhotographerStatusNotificationAsync(PhotographerStatusNotificationDto dto);

        Task<NotificationResultDto> SendBookingCancellationNotificationAsync(BookingCancellationNotificationDto dto);

        Task<NotificationResultDto> SendRefundStatusNotificationAsync(RefundStatusNotificationDto dto);

        Task<NotificationResultDto> SendBookingReminderAsync(BookingReminderRequestDto dto);

        Task<NotificationResultDto> SendOtpVerificationAsync(OtpVerificationNotificationDto dto);

        Task<NotificationResultDto> SendBroadcastNotificationAsync(BroadcastNotificationDto dto);

        Task<bool> RetryFailedNotificationAsync(long notificationId);

        Task<IEnumerable<NotificationLog>> GetNotificationLogsAsync(
            string? recipient = null, 
            string? eventType = null, 
            string? channel = null, 
            string? status = null);

        Task<NotificationStatsDto> GetNotificationStatsAsync();

        Task<NotificationPreference?> GetNotificationPreferencesAsync(long userId);

        Task<NotificationPreference> SaveNotificationPreferencesAsync(NotificationPreferenceDto dto);

        Task<InAppNotification> CreateInAppNotificationAsync(long userId, string role, string title, string message, string type, string? actionUrl = null, string? referenceId = null);

        Task<IEnumerable<InAppNotification>> GetUserInAppNotificationsAsync(long userId, int limit = 30);

        Task<int> GetUnreadInAppNotificationCountAsync(long userId);

        Task<bool> MarkInAppNotificationAsReadAsync(long notificationId, long userId);

        Task<bool> MarkAllInAppNotificationsAsReadAsync(long userId);
    }
}
