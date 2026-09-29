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
    public class SupportController : ControllerBase
    {
        private readonly ISupportService _supportService;

        public SupportController(ISupportService supportService)
        {
            _supportService = supportService;
        }

        /// <summary>
        /// Submit a Contact Us form submission.
        /// </summary>
        [HttpPost("contact")]
        public async Task<ActionResult<ContactSubmission>> CreateContactSubmission([FromBody] CreateContactSubmissionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var submission = await _supportService.CreateContactSubmissionAsync(dto);
            return CreatedAtAction(nameof(GetContactSubmissions), new { id = submission.SubmissionId }, submission);
        }

        /// <summary>
        /// Get all Contact Us submissions (Admin view).
        /// </summary>
        [HttpGet("contact")]
        public async Task<ActionResult<IEnumerable<ContactSubmission>>> GetContactSubmissions([FromQuery] string? status = null)
        {
            var submissions = await _supportService.GetAllContactSubmissionsAsync(status);
            return Ok(submissions);
        }

        /// <summary>
        /// Create a new Support Ticket.
        /// </summary>
        [HttpPost("tickets")]
        public async Task<ActionResult<SupportTicket>> CreateTicket([FromBody] CreateSupportTicketDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _supportService.CreateSupportTicketAsync(dto);
            return CreatedAtAction(nameof(GetTicketById), new { ticketId = ticket.TicketId }, ticket);
        }

        /// <summary>
        /// Get all Support Tickets with optional filtering by status, priority, or userId.
        /// </summary>
        [HttpGet("tickets")]
        public async Task<ActionResult<IEnumerable<SupportTicket>>> GetTickets(
            [FromQuery] string? status = null, 
            [FromQuery] string? priority = null, 
            [FromQuery] long? userId = null)
        {
            var tickets = await _supportService.GetAllSupportTicketsAsync(status, priority, userId);
            return Ok(tickets);
        }

        /// <summary>
        /// Get a Support Ticket by ID including reply thread.
        /// </summary>
        [HttpGet("tickets/{ticketId:long}")]
        public async Task<ActionResult<SupportTicket>> GetTicketById(long ticketId)
        {
            var ticket = await _supportService.GetSupportTicketByIdAsync(ticketId);
            if (ticket == null)
            {
                return NotFound(new { message = $"Support Ticket with ID #{ticketId} not found." });
            }
            return Ok(ticket);
        }

        /// <summary>
        /// Get a Support Ticket by Ticket Number (e.g. TICK-20260730-XXXX).
        /// </summary>
        [HttpGet("tickets/number/{ticketNumber}")]
        public async Task<ActionResult<SupportTicket>> GetTicketByNumber(string ticketNumber)
        {
            var ticket = await _supportService.GetSupportTicketByNumberAsync(ticketNumber);
            if (ticket == null)
            {
                return NotFound(new { message = $"Support Ticket '{ticketNumber}' not found." });
            }
            return Ok(ticket);
        }

        /// <summary>
        /// Add an Admin or Customer reply to a Support Ticket thread.
        /// </summary>
        [HttpPost("tickets/{ticketId:long}/reply")]
        public async Task<ActionResult<TicketReply>> AddTicketReply(long ticketId, [FromBody] CreateTicketReplyDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var reply = await _supportService.AddTicketReplyAsync(ticketId, dto);
                return Ok(reply);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Admin update Ticket status or priority.
        /// </summary>
        [HttpPut("tickets/{ticketId:long}/status")]
        public async Task<ActionResult<SupportTicket>> UpdateTicketStatus(long ticketId, [FromBody] UpdateTicketStatusDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _supportService.UpdateTicketStatusAsync(ticketId, dto);
            if (ticket == null)
            {
                return NotFound(new { message = $"Support Ticket with ID #{ticketId} not found." });
            }
            return Ok(ticket);
        }
    }
}
