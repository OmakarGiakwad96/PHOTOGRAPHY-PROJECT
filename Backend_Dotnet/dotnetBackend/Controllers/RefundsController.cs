using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Services;

namespace PhotoHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RefundsController : ControllerBase
    {
        private readonly IRefundService _refundService;

        public RefundsController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        // Request Refund (Client)
        [HttpPost("request")]
        [HttpPost] // Fallback for POST /api/refunds
        public async Task<IActionResult> RequestRefund([FromBody] RefundRequestDto dto)
        {
            if (dto.BookingId <= 0 || dto.PaymentId <= 0 || dto.RefundAmount <= 0)
            {
                return BadRequest(new { message = "Invalid refund request parameters" });
            }

            var refund = await _refundService.RequestRefundAsync(dto);
            return Ok(refund);
        }

        // Process Refund (Admin Approve/Reject + Trigger Razorpay Refund)
        [HttpPut("{refundId}/process")]
        public async Task<IActionResult> ProcessRefund(long refundId, [FromBody] ProcessRefundDto dto)
        {
            dto.RefundId = refundId;
            var refund = await _refundService.ProcessRefundAsync(dto);
            if (refund == null) return NotFound(new { message = "Refund request record not found" });
            return Ok(refund);
        }

        // Get Refund by ID
        [HttpGet("{refundId}")]
        public async Task<IActionResult> GetRefundById(long refundId)
        {
            var refund = await _refundService.GetRefundByIdAsync(refundId);
            if (refund == null) return NotFound(new { message = "Refund record not found" });
            return Ok(refund);
        }

        // Get Refunds by User ID
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetRefundsByUser(long userId)
        {
            var refunds = await _refundService.GetRefundsByUserAsync(userId);
            return Ok(refunds);
        }

        // List All Refunds (Admin)
        [HttpGet]
        public async Task<IActionResult> GetAllRefunds()
        {
            var refunds = await _refundService.GetAllRefundsAsync();
            return Ok(refunds);
        }
    }
}
