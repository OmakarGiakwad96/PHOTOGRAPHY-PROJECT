using System;
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
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        /// <summary>
        /// Submit customer rating &amp; review feedback.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CustomerFeedback>> CreateFeedback([FromBody] CreateFeedbackDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var feedback = await _feedbackService.CreateFeedbackAsync(dto);
                return CreatedAtAction(nameof(GetAllFeedback), new { id = feedback.FeedbackId }, feedback);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all customer reviews &amp; feedback (optional filters by photographerId or userId).
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerFeedback>>> GetAllFeedback(
            [FromQuery] long? photographerId = null, 
            [FromQuery] long? userId = null)
        {
            var feedbacks = await _feedbackService.GetAllFeedbackAsync(photographerId, userId);
            return Ok(feedbacks);
        }

        /// <summary>
        /// Get aggregated rating stats &amp; review breakdown for a specific photographer.
        /// </summary>
        [HttpGet("photographer/{photographerId:long}")]
        public async Task<ActionResult<PhotographerRatingStatsDto>> GetPhotographerStats(long photographerId)
        {
            var stats = await _feedbackService.GetPhotographerRatingStatsAsync(photographerId);
            return Ok(stats);
        }
    }
}
