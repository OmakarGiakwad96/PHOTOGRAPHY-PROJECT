using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PhotoHub.Api.Data;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly PhotoHubDbContext _dbContext;

        public InvoiceService(PhotoHubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<InvoiceDto> GenerateInvoiceAsync(long paymentId)
        {
            var existingInvoice = await _dbContext.Invoices
                .FirstOrDefaultAsync(i => i.PaymentId == paymentId);

            if (existingInvoice != null)
            {
                return MapToDto(existingInvoice);
            }

            var payment = await _dbContext.Payments.FindAsync(paymentId);
            if (payment == null)
            {
                throw new ArgumentException($"Payment #{paymentId} not found");
            }

            // Calculate 18% GST breakdown
            var totalAmount = payment.Amount;
            var baseAmount = Math.Round(totalAmount / 1.18m, 2);
            var taxAmount = totalAmount - baseAmount;
            var invoiceNum = $"INV-{DateTime.UtcNow:yyyyMM}-{payment.PaymentId:D6}";

            var invoice = new Invoice
            {
                InvoiceNumber = invoiceNum,
                PaymentId = payment.PaymentId,
                BookingId = payment.BookingId,
                ClientName = "PhotoHub Customer",
                ClientEmail = "client@photohub.com",
                PhotographerName = "PhotoHub Certified Partner",
                ServiceName = "Professional Photography & Post-Processing Services",
                BaseAmount = baseAmount,
                TaxAmount = taxAmount,
                DiscountAmount = 0,
                TotalAmount = totalAmount,
                Status = "Paid",
                IssuedAt = DateTime.UtcNow,
                DueDate = DateTime.UtcNow
            };

            _dbContext.Invoices.Add(invoice);
            await _dbContext.SaveChangesAsync();

            return MapToDto(invoice);
        }

        public async Task<InvoiceDto?> GetInvoiceByIdAsync(long invoiceId)
        {
            var inv = await _dbContext.Invoices.FindAsync(invoiceId);
            return inv != null ? MapToDto(inv) : null;
        }

        public async Task<InvoiceDto?> GetInvoiceByPaymentIdAsync(long paymentId)
        {
            var inv = await _dbContext.Invoices.FirstOrDefaultAsync(i => i.PaymentId == paymentId);
            return inv != null ? MapToDto(inv) : null;
        }

        public async Task<IEnumerable<InvoiceDto>> GetInvoicesByUserAsync(long userId)
        {
            var userPaymentIds = await _dbContext.Payments
                .Where(p => p.UserId == userId)
                .Select(p => p.PaymentId)
                .ToListAsync();

            var invoices = await _dbContext.Invoices
                .Where(i => userPaymentIds.Contains(i.PaymentId))
                .OrderByDescending(i => i.IssuedAt)
                .ToListAsync();

            return invoices.Select(MapToDto);
        }

        public string GenerateInvoiceHtml(InvoiceDto invoice)
        {
            var sb = new StringBuilder();
            sb.Append(@"
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'/>
<title>Invoice ").Append(invoice.InvoiceNumber).Append(@"</title>
<style>
    body { font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0b0e14; color: #e2e8f0; margin: 0; padding: 40px; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #131722; border: 1px solid #1e293b; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 24px; margin-bottom: 32px; }
    .brand { font-size: 28px; font-weight: 800; color: #10b981; font-family: serif; }
    .badge { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; font-size: 14px; }
    .details h4 { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; padding: 12px; border-bottom: 2px solid #334155; color: #94a3b8; font-size: 11px; text-transform: uppercase; }
    td { padding: 16px 12px; border-bottom: 1px solid #1e293b; font-size: 14px; }
    .summary { width: 300px; margin-left: auto; font-size: 14px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; color: #94a3b8; }
    .summary-total { display: flex; justify-content: space-between; padding: 16px 0; font-size: 20px; font-weight: 800; color: #10b981; border-top: 2px solid #334155; }
    .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 24px; }
</style>
</head>
<body>
<div class='invoice-card'>
    <div class='header'>
        <div>
            <div class='brand'>PhotoHub</div>
            <div style='color: #94a3b8; font-size: 12px; margin-top: 4px;'>Official Tax Invoice & Payment Receipt</div>
        </div>
        <div>
            <span class='badge'>PAID</span>
        </div>
    </div>

    <div class='details'>
        <div>
            <h4>Billed To</h4>
            <div style='font-weight: 700; color: #ffffff;'>").Append(invoice.ClientName).Append(@"</div>
            <div style='color: #cbd5e1;'>").Append(invoice.ClientEmail).Append(@"</div>
        </div>
        <div style='text-align: right;'>
            <h4>Invoice Info</h4>
            <div><strong>Invoice #:</strong> ").Append(invoice.InvoiceNumber).Append(@"</div>
            <div><strong>Booking #:</strong> #").Append(invoice.BookingId).Append(@"</div>
            <div><strong>Date:</strong> ").Append(invoice.IssuedAt.ToString("MMM dd, yyyy")).Append(@"</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Service Description</th>
                <th style='text-align: right;'>Base Amount</th>
                <th style='text-align: right;'>GST (18%)</th>
                <th style='text-align: right;'>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>").Append(invoice.ServiceName).Append(@"</td>
                <td style='text-align: right;'>₹").Append(invoice.BaseAmount.ToString("N2")).Append(@"</td>
                <td style='text-align: right;'>₹").Append(invoice.TaxAmount.ToString("N2")).Append(@"</td>
                <td style='text-align: right; font-weight: 700;'>₹").Append(invoice.TotalAmount.ToString("N2")).Append(@"</td>
            </tr>
        </tbody>
    </table>

    <div class='summary'>
        <div class='summary-row'>
            <span>Subtotal</span>
            <span>₹").Append(invoice.BaseAmount.ToString("N2")).Append(@"</span>
        </div>
        <div class='summary-row'>
            <span>GST Tax (18%)</span>
            <span>₹").Append(invoice.TaxAmount.ToString("N2")).Append(@"</span>
        </div>
        <div class='summary-total'>
            <span>Total Paid</span>
            <span>₹").Append(invoice.TotalAmount.ToString("N2")).Append(@"</span>
        </div>
    </div>

    <div class='footer'>
        Thank you for choosing PhotoHub. This is a computer-generated invoice requiring no physical signature.<br/>
        PhotoHub India Technologies • GSTIN: 29AAAAA0000A1Z5
    </div>
</div>
</body>
</html>");

            return sb.ToString();
        }

        private static InvoiceDto MapToDto(Invoice invoice)
        {
            return new InvoiceDto
            {
                InvoiceId = invoice.InvoiceId,
                InvoiceNumber = invoice.InvoiceNumber,
                PaymentId = invoice.PaymentId,
                BookingId = invoice.BookingId,
                ClientName = invoice.ClientName,
                ClientEmail = invoice.ClientEmail,
                PhotographerName = invoice.PhotographerName,
                ServiceName = invoice.ServiceName,
                BaseAmount = invoice.BaseAmount,
                TaxAmount = invoice.TaxAmount,
                DiscountAmount = invoice.DiscountAmount,
                TotalAmount = invoice.TotalAmount,
                Status = invoice.Status,
                IssuedAt = invoice.IssuedAt,
                DueDate = invoice.DueDate
            };
        }
    }
}
