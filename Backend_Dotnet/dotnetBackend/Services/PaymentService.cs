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
    public class PaymentService : IPaymentService
    {
        private readonly PhotoHubDbContext _dbContext;
        private readonly IRazorpayService _razorpayService;
        private readonly IInvoiceService _invoiceService;
        private readonly INotificationService? _notificationService;

        public PaymentService(
            PhotoHubDbContext dbContext, 
            IRazorpayService razorpayService, 
            IInvoiceService invoiceService,
            INotificationService? notificationService = null)
        {
            _dbContext = dbContext;
            _razorpayService = razorpayService;
            _invoiceService = invoiceService;
            _notificationService = notificationService;
        }

        public async Task<PaymentResponseDto> ProcessPaymentAsync(ProcessPaymentDto dto)
        {
            var isSignatureValid = true;
            if (!string.IsNullOrEmpty(dto.RazorpayOrderId) && !string.IsNullOrEmpty(dto.RazorpayPaymentId))
            {
                isSignatureValid = _razorpayService.VerifyPaymentSignature(
                    dto.RazorpayOrderId, dto.RazorpayPaymentId, dto.RazorpaySignature ?? string.Empty);
            }

            var txnId = string.IsNullOrEmpty(dto.RazorpayPaymentId) 
                ? $"TXN_{Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper()}"
                : dto.RazorpayPaymentId;

            var payment = new Payment
            {
                BookingId = dto.BookingId,
                UserId = dto.UserId,
                PhotographerId = dto.PhotographerId,
                Amount = dto.Amount,
                Currency = dto.Currency ?? "INR",
                PaymentMethod = dto.PaymentMethod ?? "Razorpay",
                PaymentGateway = dto.PaymentGateway ?? "Razorpay Secure",
                TransactionId = txnId,
                RazorpayOrderId = dto.RazorpayOrderId,
                RazorpayPaymentId = dto.RazorpayPaymentId,
                RazorpaySignature = dto.RazorpaySignature,
                PaymentStatus = isSignatureValid ? "Completed" : "Failed",
                PaidAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();

            // Auto Generate Invoice & Dispatch Notification
            if (payment.PaymentStatus == "Completed")
            {
                try
                {
                    await _invoiceService.GenerateInvoiceAsync(payment.PaymentId);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Auto invoice generation notice: {ex.Message}");
                }

                if (_notificationService != null)
                {
                    try
                    {
                        await _notificationService.SendPaymentSuccessNotificationAsync(new PaymentSuccessNotificationRequestDto
                        {
                            PaymentId = payment.PaymentId,
                            BookingId = payment.BookingId,
                            CustomerName = $"User #{payment.UserId}",
                            CustomerEmail = $"user{payment.UserId}@example.com",
                            Amount = payment.Amount,
                            Currency = payment.Currency,
                            TransactionId = payment.TransactionId,
                            PaymentMethod = payment.PaymentMethod,
                            PaidAt = payment.PaidAt
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Auto notification dispatch notice: {ex.Message}");
                    }
                }
            }
            else if (_notificationService != null)
            {
                try
                {
                    await _notificationService.SendPaymentFailureNotificationAsync(new PaymentFailureNotificationRequestDto
                    {
                        BookingId = payment.BookingId,
                        CustomerName = $"User #{payment.UserId}",
                        CustomerEmail = $"user{payment.UserId}@example.com",
                        Amount = payment.Amount,
                        Currency = payment.Currency,
                        FailureReason = "Payment signature verification failed",
                        TransactionId = payment.TransactionId
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Auto failure notification dispatch notice: {ex.Message}");
                }
            }

            return new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                BookingId = payment.BookingId,
                Amount = payment.Amount,
                Currency = payment.Currency,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                PaymentStatus = payment.PaymentStatus,
                PaidAt = payment.PaidAt,
                RazorpayOrderId = payment.RazorpayOrderId,
                RazorpayPaymentId = payment.RazorpayPaymentId
            };
        }

        public async Task<Payment?> GetPaymentByIdAsync(long paymentId)
        {
            return await _dbContext.Payments.FindAsync(paymentId);
        }

        public async Task<Payment?> GetPaymentByBookingIdAsync(long bookingId)
        {
            return await _dbContext.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByUserAsync(long userId)
        {
            return await _dbContext.Payments
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByPhotographerAsync(long photographerId)
        {
            return await _dbContext.Payments
                .Where(p => p.PhotographerId == photographerId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            return await _dbContext.Payments
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
}
