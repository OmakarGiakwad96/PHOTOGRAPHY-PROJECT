using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface IFeedbackService
    {
        Task<CustomerFeedback> CreateFeedbackAsync(CreateFeedbackDto dto);
        Task<IEnumerable<CustomerFeedback>> GetAllFeedbackAsync(long? photographerId = null, long? userId = null);
        Task<PhotographerRatingStatsDto> GetPhotographerRatingStatsAsync(long photographerId);
    }
}
