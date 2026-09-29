using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Data;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Services;
using Xunit;

namespace PhotoHub.Api.Services
{
    public class SupportServiceValidationTests
    {
        private PhotoHubDbContext GetInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<PhotoHubDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            return new PhotoHubDbContext(options);
        }

        [Fact]
        public async Task CreateContactSubmission_SavesSuccessfully()
        {
            using var context = GetInMemoryDbContext("Test_ContactSubmissions");
            var service = new SupportService(context);

            var dto = new CreateContactSubmissionDto
            {
                Name = "Alice Smith",
                Email = "alice@example.com",
                Phone = "+919876543210",
                Subject = "Inquiry about Wedding Photography",
                Message = "Hello, I would like to check availability for next month.",
                Category = "Booking"
            };

            var result = await service.CreateContactSubmissionAsync(dto);

            Assert.NotNull(result);
            Assert.True(result.SubmissionId > 0);
            Assert.Equal("New", result.Status);
            Assert.Equal("alice@example.com", result.Email);
        }

        [Fact]
        public async Task CreateSupportTicket_GeneratesValidTicketNumber()
        {
            using var context = GetInMemoryDbContext("Test_SupportTickets");
            var service = new SupportService(context);

            var dto = new CreateSupportTicketDto
            {
                CustomerName = "John Doe",
                CustomerEmail = "john@example.com",
                Subject = "Payment issue on checkout",
                Description = "My card was charged but order status says pending.",
                Category = "Payment",
                Priority = "High"
            };

            var ticket = await service.CreateSupportTicketAsync(dto);

            Assert.NotNull(ticket);
            Assert.StartsWith("TICK-", ticket.TicketNumber);
            Assert.Equal("Open", ticket.Status);
            Assert.Equal("High", ticket.Priority);
        }

        [Fact]
        public async Task AddTicketReply_UpdatesTicketStatusAndThread()
        {
            using var context = GetInMemoryDbContext("Test_TicketReplies");
            var service = new SupportService(context);

            var ticket = await service.CreateSupportTicketAsync(new CreateSupportTicketDto
            {
                CustomerName = "Jane Doe",
                CustomerEmail = "jane@example.com",
                Subject = "Unable to download invoice",
                Description = "The invoice download button shows an error."
            });

            var replyDto = new CreateTicketReplyDto
            {
                SenderName = "Support Admin",
                IsAdmin = true,
                Message = "We have fixed the link. Please try again now."
            };

            var reply = await service.AddTicketReplyAsync(ticket.TicketId, replyDto);

            Assert.NotNull(reply);
            Assert.True(reply.IsAdminReply);

            var updatedTicket = await service.GetSupportTicketByIdAsync(ticket.TicketId);
            Assert.NotNull(updatedTicket);
            Assert.Equal("InProgress", updatedTicket.Status);
            Assert.Single(updatedTicket.Replies);
        }

        [Fact]
        public async Task CreateFeedback_ThrowsExceptionForInvalidRating()
        {
            using var context = GetInMemoryDbContext("Test_InvalidRating");
            var service = new FeedbackService(context);

            var invalidDto = new CreateFeedbackDto
            {
                UserId = 101,
                CustomerName = "Bob",
                Rating = 6, // Invalid rating > 5
                Comment = "Superb service!"
            };

            await Assert.ThrowsAsync<ArgumentException>(() => service.CreateFeedbackAsync(invalidDto));
        }

        [Fact]
        public async Task ResolveComplaint_UpdatesStatusAndResolutionNotes()
        {
            using var context = GetInMemoryDbContext("Test_ResolveComplaint");
            var complaintService = new ComplaintService(context);

            var complaint = await complaintService.CreateComplaintAsync(new CreateComplaintDto
            {
                UserId = 202,
                CustomerName = "Carlos",
                CustomerEmail = "carlos@example.com",
                IssueType = "Delay",
                Description = "Photographer arrived 45 minutes late.",
                Urgency = "High"
            });

            var resolveDto = new ResolveComplaintDto
            {
                Status = "Resolved",
                ResolutionNotes = "Issued a 15% refund coupon to customer and spoke with photographer."
            };

            var resolved = await complaintService.ResolveComplaintAsync(complaint.ComplaintId, resolveDto);

            Assert.NotNull(resolved);
            Assert.Equal("Resolved", resolved.Status);
            Assert.NotNull(resolved.ResolvedAt);
            Assert.Equal("Issued a 15% refund coupon to customer and spoke with photographer.", resolved.ResolutionNotes);
        }
    }
}
