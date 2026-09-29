using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface ISupportService
    {
        // Contact Us
        Task<ContactSubmission> CreateContactSubmissionAsync(CreateContactSubmissionDto dto);
        Task<IEnumerable<ContactSubmission>> GetAllContactSubmissionsAsync(string? status = null);

        // Support Tickets
        Task<SupportTicket> CreateSupportTicketAsync(CreateSupportTicketDto dto);
        Task<IEnumerable<SupportTicket>> GetAllSupportTicketsAsync(string? status = null, string? priority = null, long? userId = null);
        Task<SupportTicket?> GetSupportTicketByIdAsync(long ticketId);
        Task<SupportTicket?> GetSupportTicketByNumberAsync(string ticketNumber);
        Task<TicketReply> AddTicketReplyAsync(long ticketId, CreateTicketReplyDto dto);
        Task<SupportTicket?> UpdateTicketStatusAsync(long ticketId, UpdateTicketStatusDto dto);
    }
}
