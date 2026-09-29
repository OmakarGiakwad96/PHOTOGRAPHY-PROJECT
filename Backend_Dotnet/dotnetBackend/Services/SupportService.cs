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
    public class SupportService : ISupportService
    {
        private readonly PhotoHubDbContext _dbContext;

        public SupportService(PhotoHubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ContactSubmission> CreateContactSubmissionAsync(CreateContactSubmissionDto dto)
        {
            var submission = new ContactSubmission
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Subject = dto.Subject,
                Message = dto.Message,
                Category = dto.Category ?? "General",
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.ContactSubmissions.Add(submission);
            await _dbContext.SaveChangesAsync();
            return submission;
        }

        public async Task<IEnumerable<ContactSubmission>> GetAllContactSubmissionsAsync(string? status = null)
        {
            var query = _dbContext.ContactSubmissions.AsQueryable();
            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(c => c.Status == status);
            }
            return await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
        }

        public async Task<SupportTicket> CreateSupportTicketAsync(CreateSupportTicketDto dto)
        {
            var ticketNumber = $"TICK-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper()}";

            var ticket = new SupportTicket
            {
                TicketNumber = ticketNumber,
                UserId = dto.UserId,
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                Subject = dto.Subject,
                Description = dto.Description,
                Category = dto.Category ?? "General",
                Priority = dto.Priority ?? "Medium",
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.SupportTickets.Add(ticket);
            await _dbContext.SaveChangesAsync();
            return ticket;
        }

        public async Task<IEnumerable<SupportTicket>> GetAllSupportTicketsAsync(string? status = null, string? priority = null, long? userId = null)
        {
            var query = _dbContext.SupportTickets.Include(t => t.Replies).AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(t => t.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(priority))
            {
                query = query.Where(t => t.Priority == priority);
            }

            if (userId.HasValue)
            {
                query = query.Where(t => t.UserId == userId.Value);
            }

            return await query.OrderByDescending(t => t.UpdatedAt).ToListAsync();
        }

        public async Task<SupportTicket?> GetSupportTicketByIdAsync(long ticketId)
        {
            return await _dbContext.SupportTickets
                .Include(t => t.Replies.OrderBy(r => r.CreatedAt))
                .FirstOrDefaultAsync(t => t.TicketId == ticketId);
        }

        public async Task<SupportTicket?> GetSupportTicketByNumberAsync(string ticketNumber)
        {
            return await _dbContext.SupportTickets
                .Include(t => t.Replies.OrderBy(r => r.CreatedAt))
                .FirstOrDefaultAsync(t => t.TicketNumber == ticketNumber);
        }

        public async Task<TicketReply> AddTicketReplyAsync(long ticketId, CreateTicketReplyDto dto)
        {
            var ticket = await _dbContext.SupportTickets.FindAsync(ticketId);
            if (ticket == null)
            {
                throw new KeyNotFoundException($"Support Ticket with ID #{ticketId} not found.");
            }

            var reply = new TicketReply
            {
                TicketId = ticketId,
                SenderType = dto.IsAdmin ? "Admin" : "Customer",
                SenderName = dto.SenderName,
                Message = dto.Message,
                IsAdminReply = dto.IsAdmin,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.TicketReplies.Add(reply);

            // Automatically update ticket state
            ticket.UpdatedAt = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(dto.StatusUpdate))
            {
                ticket.Status = dto.StatusUpdate;
            }
            else if (dto.IsAdmin && ticket.Status == "Open")
            {
                ticket.Status = "InProgress";
            }

            await _dbContext.SaveChangesAsync();
            return reply;
        }

        public async Task<SupportTicket?> UpdateTicketStatusAsync(long ticketId, UpdateTicketStatusDto dto)
        {
            var ticket = await _dbContext.SupportTickets.FindAsync(ticketId);
            if (ticket == null)
            {
                return null;
            }

            ticket.Status = dto.Status;
            if (!string.IsNullOrWhiteSpace(dto.Priority))
            {
                ticket.Priority = dto.Priority;
            }

            ticket.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            return ticket;
        }
    }
}
