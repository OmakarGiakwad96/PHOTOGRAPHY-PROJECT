using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Data
{
    public class PhotoHubDbContext : DbContext
    {
        public PhotoHubDbContext(DbContextOptions<PhotoHubDbContext> options) : base(options)
        {
        }

        public DbSet<Photographer> Photographers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Refund> Refunds { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<PaymentIssue> PaymentIssues { get; set; }
        public DbSet<NotificationLog> NotificationLogs { get; set; }
        public DbSet<ContactSubmission> ContactSubmissions { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        public DbSet<TicketReply> TicketReplies { get; set; }
        public DbSet<CustomerFeedback> CustomerFeedbacks { get; set; }
        public DbSet<Complaint> Complaints { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Photographer>()
                .HasIndex(p => p.Email)
                .IsUnique();

            modelBuilder.Entity<Payment>()
                .HasIndex(p => p.BookingId);

            modelBuilder.Entity<Payment>()
                .HasIndex(p => p.TransactionId);

            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.InvoiceNumber)
                .IsUnique();

            modelBuilder.Entity<NotificationLog>()
                .HasIndex(n => n.Recipient);

            modelBuilder.Entity<NotificationLog>()
                .HasIndex(n => n.EventType);

            modelBuilder.Entity<SupportTicket>()
                .HasIndex(t => t.TicketNumber)
                .IsUnique();

            modelBuilder.Entity<Complaint>()
                .HasIndex(c => c.ComplaintNumber)
                .IsUnique();
        }
    }
}
