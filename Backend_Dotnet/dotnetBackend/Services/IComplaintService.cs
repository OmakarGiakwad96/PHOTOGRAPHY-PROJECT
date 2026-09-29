using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface IComplaintService
    {
        Task<Complaint> CreateComplaintAsync(CreateComplaintDto dto);
        Task<IEnumerable<Complaint>> GetAllComplaintsAsync(string? status = null, string? urgency = null, long? userId = null);
        Task<Complaint?> GetComplaintByIdAsync(long complaintId);
        Task<Complaint?> GetComplaintByNumberAsync(string complaintNumber);
        Task<Complaint?> ResolveComplaintAsync(long complaintId, ResolveComplaintDto dto);
    }
}
