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
    public class FeedbackService : IFeedbackService
    {
        private readonly PhotoHubDbContext _dbContext;

        public FeedbackService(PhotoHubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CustomerFeedback> CreateFeedbackAsync(CreateFeedbackDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5 stars.");
            }

            var feedback = new CustomerFeedback
            {
                UserId = dto.UserId,
                CustomerName = dto.CustomerName,
                PhotographerId = dto.PhotographerId,
                BookingId = dto.BookingId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                ServiceCategory = dto.ServiceCategory ?? "General",
                FeedbackDate = DateTime.UtcNow
            };

            _dbContext.CustomerFeedbacks.Add(feedback);
            await _dbContext.SaveChangesAsync();

            // Update photographer rating if photographerId exists
            if (dto.PhotographerId.HasValue && dto.PhotographerId.Value > 0)
            {
                var photographer = await _dbContext.Photographers.FindAsync(dto.PhotographerId.Value);
                if (photographer != null)
                {
                    var allRatings = await _dbContext.CustomerFeedbacks
                        .Where(f => f.PhotographerId == dto.PhotographerId.Value)
                        .Select(f => f.Rating)
                        .ToListAsync();

                    photographer.Rating = Math.Round(allRatings.Average(), 1);
                    photographer.ReviewCount = allRatings.Count;
                    await _dbContext.SaveChangesAsync();
                }
            }

            return feedback;
        }

        public async Task<IEnumerable<CustomerFeedback>> GetAllFeedbackAsync(long? photographerId = null, long? userId = null)
        {
            var query = _dbContext.CustomerFeedbacks.AsQueryable();

            if (photographerId.HasValue)
            {
                query = query.Where(f => f.PhotographerId == photographerId.Value);
            }

            if (userId.HasValue)
            {
                query = query.Where(f => f.UserId == userId.Value);
            }

            return await query.OrderByDescending(f => f.FeedbackDate).ToListAsync();
        }

        public async Task<PhotographerRatingStatsDto> GetPhotographerRatingStatsAsync(long photographerId)
        {
            var reviews = await _dbContext.CustomerFeedbacks
                .Where(f => f.PhotographerId == photographerId)
                .ToListAsync();

            if (!reviews.Any())
            {
                return new PhotographerRatingStatsDto
                {
                    PhotographerId = photographerId,
                    AverageRating = 0.0,
                    TotalReviews = 0
                };
            }

            return new PhotographerRatingStatsDto
            {
                PhotographerId = photographerId,
                AverageRating = Math.Round(reviews.Average(r => r.Rating), 1),
                TotalReviews = reviews.Count,
                FiveStarCount = reviews.Count(r => r.Rating == 5),
                FourStarCount = reviews.Count(r => r.Rating == 4),
                ThreeStarCount = reviews.Count(r => r.Rating == 3),
                TwoStarCount = reviews.Count(r => r.Rating == 2),
                OneStarCount = reviews.Count(r => r.Rating == 1)
            };
        }
    }
}
