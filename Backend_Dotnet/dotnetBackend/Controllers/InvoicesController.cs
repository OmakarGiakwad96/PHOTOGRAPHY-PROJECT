using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PhotoHub.Api.Services;

namespace PhotoHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        // Generate Invoice for Payment
        [HttpPost("generate/{paymentId}")]
        public async Task<IActionResult> GenerateInvoice(long paymentId)
        {
            try
            {
                var invoice = await _invoiceService.GenerateInvoiceAsync(paymentId);
                return Ok(invoice);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get Invoice by ID
        [HttpGet("{invoiceId}")]
        public async Task<IActionResult> GetInvoiceById(long invoiceId)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(invoiceId);
            if (invoice == null) return NotFound(new { message = "Invoice record not found" });
            return Ok(invoice);
        }

        // Get Invoice by Payment ID
        [HttpGet("payment/{paymentId}")]
        public async Task<IActionResult> GetInvoiceByPayment(long paymentId)
        {
            var invoice = await _invoiceService.GetInvoiceByPaymentIdAsync(paymentId);
            if (invoice == null)
            {
                // Auto generate if missing
                try
                {
                    invoice = await _invoiceService.GenerateInvoiceAsync(paymentId);
                }
                catch
                {
                    return NotFound(new { message = "No invoice found for this payment" });
                }
            }
            return Ok(invoice);
        }

        // Get Invoices by User ID
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetInvoicesByUser(long userId)
        {
            var invoices = await _invoiceService.GetInvoicesByUserAsync(userId);
            return Ok(invoices);
        }

        // Download Printable HTML/PDF Invoice Document
        [HttpGet("download/{paymentId}")]
        public async Task<IActionResult> DownloadInvoice(long paymentId)
        {
            var invoice = await _invoiceService.GetInvoiceByPaymentIdAsync(paymentId);
            if (invoice == null)
            {
                try
                {
                    invoice = await _invoiceService.GenerateInvoiceAsync(paymentId);
                }
                catch
                {
                    return NotFound(new { message = "Invoice not available for download" });
                }
            }

            var htmlContent = _invoiceService.GenerateInvoiceHtml(invoice);
            return Content(htmlContent, "text/html", System.Text.Encoding.UTF8);
        }
    }
}
