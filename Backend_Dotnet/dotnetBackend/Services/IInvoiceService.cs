using System.Collections.Generic;
using System.Threading.Tasks;
using PhotoHub.Api.DTOs;
using PhotoHub.Api.Models;

namespace PhotoHub.Api.Services
{
    public interface IInvoiceService
    {
        Task<InvoiceDto> GenerateInvoiceAsync(long paymentId);
        Task<InvoiceDto?> GetInvoiceByIdAsync(long invoiceId);
        Task<InvoiceDto?> GetInvoiceByPaymentIdAsync(long paymentId);
        Task<IEnumerable<InvoiceDto>> GetInvoicesByUserAsync(long userId);
        string GenerateInvoiceHtml(InvoiceDto invoice);
    }
}
