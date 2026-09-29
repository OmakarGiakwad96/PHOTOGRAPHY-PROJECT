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
    public class ComplaintService : IComplaintService
    {
        private readonly PhotoHubDbContext _dbContext;

        public ComplaintService(PhotoHubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Complaint> CreateComplaintAsync(CreateComplaintDto dto)
        {
            var cmpNumber = $"CMP-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper()}";

            var complaint = new Complaint
            {
                ComplaintNumber = cmpNumber,
                UserId = dto.UserId,
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                BookingId = dto.BookingId,
                IssueType = dto.IssueType ?? "Other",
                Description = dto.Description,
                Urgency = dto.Urgency ?? "Medium",
                Status = "Submitted",
                SubmittedAt = DateTime.UtcNow
            };

            _dbContext.Complaints.Add(complaint);
            await _dbContext.SaveChangesAsync();
            return complaint;
        }

        public async Task<IEnumerable<Complaint>> GetAllComplaintsAsync(string? status = null, string? urgency = null, long? userId = null)
        {
            var query = _dbContext.Complaints.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(c => c.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(urgency))
            {
                query = query.Where(c => c.Urgency == urgency);
            }

            if (userId.HasValue)
            {
                query = query.Where(c => c.UserId == userId.Value);
            }

            return await query.OrderByDescending(c => c.SubmittedAt).ToListAsync();
        }

        public async Task<Complaint?> GetComplaintByIdAsync(long complaintId)
        {
            return await _dbContext.Complaints.FindAsync(complaintId);
        }

        public async Task<Complaint?> GetComplaintByNumberAsync(string complaintNumber)
        {
            return await _dbContext.Complaints.FirstOrDefaultAsync(c => c.ComplaintNumber == complaintNumber);
        }

        public async Task<Complaint?> ResolveComplaintAsync(long complaintId, ResolveComplaintDto dto)
        {
            var complaint = await _dbContext.Complaints.FindAsync(complaintId);
            if (complaint == null)
            {
                return null;
            }

            complaint.Status = dto.Status ?? "Resolved";
            complaint.ResolutionNotes = dto.ResolutionNotes;
            complaint.ResolvedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return complaint;
        }
    }
}
