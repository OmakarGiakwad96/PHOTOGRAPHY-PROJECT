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
    public class RefundService : IRefundService
    {
        private readonly PhotoHubDbContext _dbContext;
        private readonly IRazorpayService _razorpayService;

        public RefundService(PhotoHubDbContext dbContext, IRazorpayService razorpayService)
        {
            _dbContext = dbContext;
            _razorpayService = razorpayService;
        }

        public async Task<Refund> RequestRefundAsync(RefundRequestDto dto)
        {
            var existingRefund = await _dbContext.Refunds
                .FirstOrDefaultAsync(r => r.BookingId == dto.BookingId && r.PaymentId == dto.PaymentId);

            if (existingRefund != null)
            {
                return existingRefund;
            }

            var refund = new Refund
            {
                BookingId = dto.BookingId,
                PaymentId = dto.PaymentId,
                UserId = dto.UserId,
                RefundAmount = dto.RefundAmount,
                RefundReason = dto.RefundReason,
                RefundStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Refunds.Add(refund);
            await _dbContext.SaveChangesAsync();
            return refund;
        }

        public async Task<Refund?> ProcessRefundAsync(ProcessRefundDto dto)
        {
            var refund = await _dbContext.Refunds.FindAsync(dto.RefundId);
            if (refund == null) return null;

            if (dto.IsApproved)
            {
                refund.RefundStatus = "Approved";
                refund.ApprovedByAdmin = dto.AdminUserId;
                refund.ProcessedAt = DateTime.UtcNow;

                var payment = await _dbContext.Payments.FindAsync(refund.PaymentId);
                if (payment != null)
                {
                    payment.PaymentStatus = "Refunded";
                    
                    if (!string.IsNullOrEmpty(payment.RazorpayPaymentId))
                    {
                        var rzpRefundId = await _razorpayService.TriggerRazorpayRefundAsync(
                            payment.RazorpayPaymentId, refund.RefundAmount, refund.RefundReason);
                        refund.RazorpayRefundId = rzpRefundId;
                    }
                }
            }
            else
            {
                refund.RefundStatus = "Rejected";
                refund.ApprovedByAdmin = dto.AdminUserId;
                refund.ProcessedAt = DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync();
            return refund;
        }

        public async Task<Refund?> GetRefundByIdAsync(long refundId)
        {
            return await _dbContext.Refunds.FindAsync(refundId);
        }

        public async Task<IEnumerable<Refund>> GetRefundsByUserAsync(long userId)
        {
            return await _dbContext.Refunds
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Refund>> GetAllRefundsAsync()
        {
            return await _dbContext.Refunds
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }
    }
}
