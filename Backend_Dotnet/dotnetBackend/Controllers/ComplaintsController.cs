using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;
using PhotoHub.Api.Services;

namespace PhotoHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintsController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

        /// <summary>
        /// File a new Customer Complaint.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Complaint>> CreateComplaint([FromBody] CreateComplaintDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var complaint = await _complaintService.CreateComplaintAsync(dto);
            return CreatedAtAction(nameof(GetComplaintById), new { complaintId = complaint.ComplaintId }, complaint);
        }

        /// <summary>
        /// Get all customer complaints (Admin view with optional filters by status, urgency, userId).
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Complaint>>> GetComplaints(
            [FromQuery] string? status = null, 
            [FromQuery] string? urgency = null, 
            [FromQuery] long? userId = null)
        {
            var complaints = await _complaintService.GetAllComplaintsAsync(status, urgency, userId);
            return Ok(complaints);
        }

        /// <summary>
        /// Get complaint details by ID.
        /// </summary>
        [HttpGet("{complaintId:long}")]
        public async Task<ActionResult<Complaint>> GetComplaintById(long complaintId)
        {
            var complaint = await _complaintService.GetComplaintByIdAsync(complaintId);
            if (complaint == null)
            {
                return NotFound(new { message = $"Complaint with ID #{complaintId} not found." });
            }
            return Ok(complaint);
        }

        /// <summary>
        /// Get complaint details by Complaint Tracking Number (e.g. CMP-20260730-XXXX).
        /// </summary>
        [HttpGet("number/{complaintNumber}")]
        public async Task<ActionResult<Complaint>> GetComplaintByNumber(string complaintNumber)
        {
            var complaint = await _complaintService.GetComplaintByNumberAsync(complaintNumber);
            if (complaint == null)
            {
                return NotFound(new { message = $"Complaint tracking number '{complaintNumber}' not found." });
            }
            return Ok(complaint);
        }

        /// <summary>
        /// Admin resolve or update status of a Customer Complaint with resolution notes.
        /// </summary>
        [HttpPut("{complaintId:long}/resolve")]
        public async Task<ActionResult<Complaint>> ResolveComplaint(long complaintId, [FromBody] ResolveComplaintDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var complaint = await _complaintService.ResolveComplaintAsync(complaintId, dto);
            if (complaint == null)
            {
                return NotFound(new { message = $"Complaint with ID #{complaintId} not found." });
            }
            return Ok(complaint);
        }
    }
}
