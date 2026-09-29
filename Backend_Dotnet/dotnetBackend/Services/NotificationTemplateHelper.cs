using System;
using PhotoHub.Api.DTOs;

namespace PhotoHub.Api.Services
{
    public static class NotificationTemplateHelper
    {
        public static (string Subject, string HtmlBody, string SmsText) GenerateBookingConfirmation(BookingConfirmationRequestDto dto)
        {
            var subject = $"📸 Booking Confirmed! [Booking #{dto.BookingId}]";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }}
        .header {{ background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
        .header p {{ margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }}
        .content {{ padding: 30px 25px; color: #334155; line-height: 1.6; }}
        .details-card {{ background: #f8fafc; border-left: 4px solid #4f46e5; padding: 15px 20px; border-radius: 0 6px 6px 0; margin: 20px 0; }}
        .details-card table {{ width: 100%; border-collapse: collapse; }}
        .details-card td {{ padding: 8px 0; font-size: 14px; }}
        .details-card td.label {{ color: #64748b; font-weight: 600; width: 40%; }}
        .details-card td.value {{ color: #0f172a; font-weight: 500; }}
        .footer {{ background: #f1f5f9; padding: 15px 20px; text-align: center; font-size: 12px; color: #64748b; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Booking Confirmed!</h1>
            <p>Your photoshoot with PhotoHub is locked in</p>
        </div>
        <div class='content'>
            <p>Hi <strong>{dto.CustomerName}</strong>,</p>
            <p>Great news! Your booking <strong>#{dto.BookingId}</strong> has been successfully confirmed. Below are your session details:</p>
            
            <div class='details-card'>
                <table>
                    <tr><td class='label'>Booking ID:</td><td class='value'>#{dto.BookingId}</td></tr>
                    <tr><td class='label'>Photographer:</td><td class='value'>{dto.PhotographerName}</td></tr>
                    <tr><td class='label'>Package:</td><td class='value'>{dto.PackageName}</td></tr>
                    <tr><td class='label'>Date & Time:</td><td class='value'>{dto.EventDate:dd MMMM yyyy, hh:mm tt}</td></tr>
                    <tr><td class='label'>Location:</td><td class='value'>{dto.Location}</td></tr>
                    <tr><td class='label'>Amount Paid:</td><td class='value'>₹{dto.Amount:N2}</td></tr>
                </table>
            </div>

            <p>Our photographer will contact you prior to the event to coordinate setup and preferences.</p>
            <p>Thank you for choosing <strong>PhotoHub</strong>!</p>
        </div>
        <div class='footer'>
            <p>© {DateTime.UtcNow.Year} PhotoHub Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

            var smsText = $"Hi {dto.CustomerName}, your PhotoHub booking #{dto.BookingId} with {dto.PhotographerName} on {dto.EventDate:dd MMM yyyy} is CONFIRMED. Total: ₹{dto.Amount:N2}. Thank you!";

            return (subject, htmlBody, smsText);
        }

        public static (string Subject, string HtmlBody, string SmsText) GenerateBookingReminder(BookingReminderRequestDto dto)
        {
            var subject = $"⏰ Upcoming Shoot Reminder [Booking #{dto.BookingId}]";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }}
        .header {{ background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
        .content {{ padding: 30px 25px; color: #334155; line-height: 1.6; }}
        .details-card {{ background: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px 20px; border-radius: 0 6px 6px 0; margin: 20px 0; }}
        .details-card table {{ width: 100%; border-collapse: collapse; }}
        .details-card td {{ padding: 8px 0; font-size: 14px; }}
        .details-card td.label {{ color: #0369a1; font-weight: 600; width: 40%; }}
        .footer {{ background: #f1f5f9; padding: 15px 20px; text-align: center; font-size: 12px; color: #64748b; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Reminder: Upcoming Photoshoot!</h1>
        </div>
        <div class='content'>
            <p>Hi <strong>{dto.CustomerName}</strong>,</p>
            <p>This is a friendly reminder for your upcoming photography session scheduled for <strong>{dto.EventDate:dd MMMM yyyy}</strong>.</p>
            
            <div class='details-card'>
                <table>
                    <tr><td class='label'>Booking Ref:</td><td>#{dto.BookingId}</td></tr>
                    <tr><td class='label'>Photographer:</td><td>{dto.PhotographerName}</td></tr>
                    <tr><td class='label'>Date & Time:</td><td>{dto.EventDate:dd MMMM yyyy, hh:mm tt}</td></tr>
                    <tr><td class='label'>Location:</td><td>{dto.Location}</td></tr>
                </table>
            </div>

            <p>Please ensure you arrive 10-15 minutes early at the venue. Contact support if you need to adjust schedule.</p>
        </div>
        <div class='footer'>
            <p>© {DateTime.UtcNow.Year} PhotoHub Inc.</p>
        </div>
    </div>
</body>
</html>";

            var smsText = $"REMINDER: Hi {dto.CustomerName}, your PhotoHub shoot #{dto.BookingId} is scheduled on {dto.EventDate:dd MMM yyyy, hh:mm tt} at {dto.Location}. Photographer: {dto.PhotographerName}.";

            return (subject, htmlBody, smsText);
        }

        public static (string Subject, string HtmlBody, string SmsText) GeneratePaymentSuccess(PaymentSuccessNotificationRequestDto dto)
        {
            var subject = $"✅ Payment Successful for Booking #{dto.BookingId}";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }}
        .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
        .content {{ padding: 30px 25px; color: #334155; line-height: 1.6; }}
        .receipt-box {{ background: #ecfdf5; border: 1px dashed #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }}
        .amount {{ font-size: 28px; font-weight: 800; color: #047857; margin: 10px 0; }}
        .footer {{ background: #f1f5f9; padding: 15px 20px; text-align: center; font-size: 12px; color: #64748b; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Payment Received!</h1>
            <p>Thank you for your payment</p>
        </div>
        <div class='content'>
            <p>Hi <strong>{dto.CustomerName}</strong>,</p>
            <p>We have successfully received your payment for Booking <strong>#{dto.BookingId}</strong>.</p>
            
            <div class='receipt-box'>
                <div>Amount Paid</div>
                <div class='amount'>₹{dto.Amount:N2} {dto.Currency}</div>
                <div style='font-size:13px; color:#4b5563;'>Txn ID: {dto.TransactionId} | Payment ID: #{dto.PaymentId}</div>
                <div style='font-size:13px; color:#4b5563;'>Date: {dto.PaidAt:dd MMM yyyy, hh:mm tt}</div>
            </div>

            <p>Your payment receipt and invoice have been generated and recorded in your PhotoHub account.</p>
        </div>
        <div class='footer'>
            <p>© {DateTime.UtcNow.Year} PhotoHub Inc.</p>
        </div>
    </div>
</body>
</html>";

            var smsText = $"PhotoHub: Payment of ₹{dto.Amount:N2} received successfully for Booking #{dto.BookingId}. Txn ID: {dto.TransactionId}. Thank you!";

            return (subject, htmlBody, smsText);
        }

        public static (string Subject, string HtmlBody, string SmsText) GeneratePaymentFailure(PaymentFailureNotificationRequestDto dto)
        {
            var subject = $"⚠️ Action Required: Payment Failed for Booking #{dto.BookingId}";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }}
        .header {{ background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 30px 20px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
        .content {{ padding: 30px 25px; color: #334155; line-height: 1.6; }}
        .alert-box {{ background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 0 6px 6px 0; margin: 20px 0; }}
        .footer {{ background: #f1f5f9; padding: 15px 20px; text-align: center; font-size: 12px; color: #64748b; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Payment Transaction Failed</h1>
        </div>
        <div class='content'>
            <p>Hi <strong>{dto.CustomerName}</strong>,</p>
            <p>We were unable to process your payment of <strong>₹{dto.Amount:N2}</strong> for Booking <strong>#{dto.BookingId}</strong>.</p>
            
            <div class='alert-box'>
                <strong>Reason:</strong> {dto.FailureReason}<br/>
                {(string.IsNullOrEmpty(dto.TransactionId) ? "" : $"Transaction Ref: {dto.TransactionId}")}
            </div>

            <p>Please try processing your payment again or use an alternative payment method to complete your booking.</p>
        </div>
        <div class='footer'>
            <p>© {DateTime.UtcNow.Year} PhotoHub Inc.</p>
        </div>
    </div>
</body>
</html>";

            var smsText = $"ALERT: Payment of ₹{dto.Amount:N2} for PhotoHub Booking #{dto.BookingId} FAILED. Reason: {dto.FailureReason}. Please retry from your account dashboard.";

            return (subject, htmlBody, smsText);
        }
    }
}
