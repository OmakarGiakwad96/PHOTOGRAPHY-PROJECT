using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PhotoHub.Api.Data;

namespace PhotoHub.Api.Services
{
    public class NotificationOutboxProcessor : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationOutboxProcessor> _logger;
        private readonly TimeSpan _pollInterval = TimeSpan.FromSeconds(20);

        public NotificationOutboxProcessor(
            IServiceProvider serviceProvider, 
            ILogger<NotificationOutboxProcessor> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("PhotoHub Notification Outbox Processor started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessPendingNotificationsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception in Notification Outbox Processor execution tick.");
                }

                await Task.Delay(_pollInterval, stoppingToken);
            }

            _logger.LogInformation("PhotoHub Notification Outbox Processor stopped.");
        }

        private async Task ProcessPendingNotificationsAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PhotoHubDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            var now = DateTime.UtcNow;

            // Fetch pending or retriable notifications
            var pendingItems = await dbContext.NotificationLogs
                .Where(n => n.Status == "Pending" || 
                           (n.Status == "Failed" && n.RetryCount < n.MaxRetries && n.NextRetryAt.HasValue && n.NextRetryAt.Value <= now))
                .OrderBy(n => n.SentAt)
                .Take(10)
                .ToListAsync(stoppingToken);

            if (pendingItems.Count == 0) return;

            _logger.LogInformation("Processing {Count} queued notifications in Outbox background worker...", pendingItems.Count);

            foreach (var item in pendingItems)
            {
                if (stoppingToken.IsCancellationRequested) break;

                try
                {
                    await notificationService.RetryFailedNotificationAsync(item.NotificationId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process outbox item ID #{Id}", item.NotificationId);
                    item.RetryCount++;
                    item.NextRetryAt = DateTime.UtcNow.AddMinutes(Math.Pow(2, Math.Min(item.RetryCount, 5)));
                    item.UpdatedAt = DateTime.UtcNow;
                    await dbContext.SaveChangesAsync(stoppingToken);
                }
            }
        }
    }
}
