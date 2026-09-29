using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> ProcessPaymentAsync(ProcessPaymentDto dto);
        Task<Payment?> GetPaymentByIdAsync(long paymentId);
        Task<Payment?> GetPaymentByBookingIdAsync(long bookingId);
        Task<IEnumerable<Payment>> GetPaymentsByUserAsync(long userId);
        Task<IEnumerable<Payment>> GetPaymentsByPhotographerAsync(long photographerId);
        Task<IEnumerable<Payment>> GetAllPaymentsAsync();
    }
}
