using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Data;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotographersController : ControllerBase
    {
        private readonly PhotoHubDbContext _context;

        public PhotographersController(PhotoHubDbContext context)
        {
            _context = context;
        }

        // GET: api/photographers?category=Wedding&location=Mumbai&search=keyword
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Photographer>>> GetPhotographers(
            [FromQuery] string? category,
            [FromQuery] string? location,
            [FromQuery] string? search)
        {
            var query = _context.Photographers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(p => p.Category != null && p.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(p => p.Location != null && p.Location.ToLower() == location.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => (p.Name != null && p.Name.ToLower().Contains(search.ToLower())) ||
                                         (p.Bio != null && p.Bio.ToLower().Contains(search.ToLower())));
            }

            return await query.ToListAsync();
        }

        // GET: api/photographers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Photographer>> GetPhotographer(long id)
        {
            var photographer = await _context.Photographers.FindAsync(id);

            if (photographer == null)
            {
                return NotFound();
            }

            return photographer;
        }

        // POST: api/photographers
        [HttpPost]
        public async Task<ActionResult<Photographer>> CreatePhotographer(Photographer photographer)
        {
            photographer.CreatedAt = DateTime.UtcNow;
            _context.Photographers.Add(photographer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPhotographer), new { id = photographer.Id }, photographer);
        }

        // PUT: api/photographers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhotographer(long id, Photographer details)
        {
            var existing = await _context.Photographers.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            if (details.Name != null) existing.Name = details.Name;
            if (details.Email != null) existing.Email = details.Email;
            if (details.Phone != null) existing.Phone = details.Phone;
            if (details.Location != null) existing.Location = details.Location;
            if (details.Category != null) existing.Category = details.Category;
            if (details.Bio != null) existing.Bio = details.Bio;
            if (details.StartingPrice != 0) existing.StartingPrice = details.StartingPrice;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhotographerExists(id)) return NotFound();
                else throw;
            }

            return Ok(existing);
        }

        // PATCH: api/photographers/5/verify
        [HttpPatch("{id}/verify")]
        public async Task<IActionResult> VerifyPhotographer(long id)
        {
            var photographer = await _context.Photographers.FindAsync(id);
            if (photographer == null)
            {
                return NotFound();
            }

            photographer.Verified = true;
            await _context.SaveChangesAsync();

            return Ok(photographer);
        }

        // DELETE: api/photographers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhotographer(long id)
        {
            var photographer = await _context.Photographers.FindAsync(id);
            if (photographer == null)
            {
                return NotFound();
            }

            _context.Photographers.Remove(photographer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PhotographerExists(long id)
        {
            return _context.Photographers.Any(e => e.Id == id);
        }
    }
}
