using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface IRefundService
    {
        Task<Refund> RequestRefundAsync(RefundRequestDto dto);
        Task<Refund?> ProcessRefundAsync(ProcessRefundDto dto);
        Task<Refund?> GetRefundByIdAsync(long refundId);
        Task<IEnumerable<Refund>> GetRefundsByUserAsync(long userId);
        Task<IEnumerable<Refund>> GetAllRefundsAsync();
    }
}
