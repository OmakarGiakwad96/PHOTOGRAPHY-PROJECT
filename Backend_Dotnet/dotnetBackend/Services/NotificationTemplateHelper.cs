using System;
using System.Collections.Generic;
using PhotoHub.Api.DTOs;

namespace PhotoHub.Api.Services
{
    public static class NotificationTemplateHelper
    {
        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GenerateBookingConfirmation(BookingConfirmationRequestDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var bookingUrl = !string.IsNullOrWhiteSpace(dto.BookingUrl) 
                ? dto.BookingUrl 
                : "https://www.photohubconnect.store/client/bookings";
            var eventDateStr = dto.EventDate.ToString("dd MMM yyyy");
            var amountStr = dto.Amount.ToString("N0");

            // WhatsApp Business Cloud API parameters matching approved template:
            // "Hello {{1}}, your PhotoHub Connect booking {{2}} is confirmed. Photographer: {{3}}. Event date: {{4}}. Amount paid: ₹{{5}}. View your booking: {{6}}."
            var waTemplate = "booking_confirmed";
            var waParams = new List<string>
            {
                dto.CustomerName,
                bookingRef,
                dto.PhotographerName,
                eventDateStr,
                amountStr,
                bookingUrl
            };

            // SMS content matching approved Indian DLT template:
            // "PhotoHub Connect: Booking {{booking_reference}} payment verified. Event date: {{event_date}}. View details: {{short_booking_url}}."
            var smsText = $"PhotoHub Connect: Booking {bookingRef} payment verified. Event date: {eventDateStr}. View details: {bookingUrl}";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "booking_reference", bookingRef },
                { "photographer_name", dto.PhotographerName },
                { "event_date", eventDateStr },
                { "amount_paid", amountStr },
                { "short_booking_url", bookingUrl }
            };

            var subject = $"📸 Booking Confirmed! [{bookingRef}]";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<body style='font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b;'>
    <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>
        <h2 style='color: #4f46e5; margin-top: 0;'>Booking Confirmed!</h2>
        <p>Hello <strong>{dto.CustomerName}</strong>,</p>
        <p>Your photoshoot session has been successfully booked with PhotoHub Connect.</p>
        <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
            <tr><td style='padding: 8px 0; color: #64748b;'>Booking Reference:</td><td style='font-weight: bold;'>{bookingRef}</td></tr>
            <tr><td style='padding: 8px 0; color: #64748b;'>Photographer:</td><td style='font-weight: bold;'>{dto.PhotographerName}</td></tr>
            <tr><td style='padding: 8px 0; color: #64748b;'>Date:</td><td style='font-weight: bold;'>{eventDateStr}</td></tr>
            <tr><td style='padding: 8px 0; color: #64748b;'>Amount Paid:</td><td style='font-weight: bold;'>₹{amountStr}</td></tr>
        </table>
        <p><a href='{bookingUrl}' style='display: inline-block; background: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none;'>View Booking</a></p>
    </div>
</body>
</html>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GeneratePaymentSuccess(PaymentSuccessNotificationRequestDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var bookingUrl = !string.IsNullOrWhiteSpace(dto.BookingUrl)
                ? dto.BookingUrl
                : "https://www.photohubconnect.store/client/bookings";
            var amountStr = dto.Amount.ToString("N0");
            var txnId = string.IsNullOrWhiteSpace(dto.TransactionId) ? $"TXN_{dto.PaymentId}" : dto.TransactionId;

            var waTemplate = "payment_verified";
            var waParams = new List<string>
            {
                dto.CustomerName,
                bookingRef,
                amountStr,
                txnId,
                bookingUrl
            };

            var smsText = $"PhotoHub Connect: Payment of ₹{amountStr} verified for booking {bookingRef}. Txn ID: {txnId}. View: {bookingUrl}";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "booking_reference", bookingRef },
                { "amount", amountStr },
                { "txn_id", txnId },
                { "short_booking_url", bookingUrl }
            };

            var subject = $"💳 Payment Received - ₹{amountStr} [{bookingRef}]";
            var htmlBody = $"<p>Hi {dto.CustomerName}, your payment of ₹{amountStr} for booking {bookingRef} was successfully verified (Txn: {txnId}).</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GeneratePaymentFailure(PaymentFailureNotificationRequestDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var retryUrl = !string.IsNullOrWhiteSpace(dto.RetryUrl)
                ? dto.RetryUrl
                : "https://www.photohubconnect.store/checkout";
            var amountStr = dto.Amount.ToString("N0");

            var waTemplate = "payment_failed";
            var waParams = new List<string>
            {
                dto.CustomerName,
                bookingRef,
                amountStr,
                dto.FailureReason,
                retryUrl
            };

            var smsText = $"PhotoHub Connect: Payment of ₹{amountStr} for booking {bookingRef} could not be completed. Reason: {dto.FailureReason}. Retry: {retryUrl}";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "booking_reference", bookingRef },
                { "failure_reason", dto.FailureReason },
                { "retry_url", retryUrl }
            };

            var subject = $"⚠️ Payment Failed [{bookingRef}]";
            var htmlBody = $"<p>Hi {dto.CustomerName}, payment for booking {bookingRef} failed. Reason: {dto.FailureReason}. You can retry your payment at {retryUrl}.</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GenerateBookingCancellation(BookingCancellationNotificationDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var eventDateStr = dto.EventDate.ToString("dd MMM yyyy");
            var refundStr = dto.RefundAmount.ToString("N0");

            var waTemplate = "booking_cancelled";
            var waParams = new List<string>
            {
                dto.CustomerName,
                bookingRef,
                eventDateStr,
                dto.Reason,
                refundStr
            };

            var smsText = $"PhotoHub Connect: Booking {bookingRef} for {eventDateStr} has been cancelled. Refund of ₹{refundStr} initiated. Thank you.";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "booking_reference", bookingRef },
                { "event_date", eventDateStr },
                { "refund_amount", refundStr }
            };

            var subject = $"❌ Booking Cancelled [{bookingRef}]";
            var htmlBody = $"<p>Hi {dto.CustomerName}, your booking {bookingRef} for {eventDateStr} has been cancelled. Refund of ₹{refundStr} has been scheduled.</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GeneratePhotographerStatus(PhotographerStatusNotificationDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var eventDateStr = dto.EventDate.ToString("dd MMM yyyy");

            var waTemplate = "photographer_status_update";
            var waParams = new List<string>
            {
                dto.CustomerName,
                dto.PhotographerName,
                dto.Status,
                bookingRef,
                eventDateStr
            };

            var smsText = $"PhotoHub Connect: {dto.PhotographerName} has {dto.Status.ToLower()} your booking {bookingRef} for {eventDateStr}.";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "photographer_name", dto.PhotographerName },
                { "status", dto.Status },
                { "booking_reference", bookingRef }
            };

            var subject = $"📸 Photographer Update: {dto.Status} [{bookingRef}]";
            var htmlBody = $"<p>Hi {dto.CustomerName}, photographer {dto.PhotographerName} has {dto.Status.ToLower()} your booking {bookingRef}.</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GenerateRefundStatus(RefundStatusNotificationDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var amountStr = dto.Amount.ToString("N0");
            var txn = dto.TransactionId ?? $"REF_{dto.RefundId}";

            var waTemplate = "refund_status_update";
            var waParams = new List<string>
            {
                dto.CustomerName,
                bookingRef,
                amountStr,
                dto.RefundStatus,
                txn
            };

            var smsText = $"PhotoHub Connect: Refund of ₹{amountStr} for booking {bookingRef} is {dto.RefundStatus}. Ref: {txn}.";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "booking_reference", bookingRef },
                { "amount", amountStr },
                { "refund_status", dto.RefundStatus }
            };

            var subject = $"💰 Refund {dto.RefundStatus} [{bookingRef}]";
            var htmlBody = $"<p>Hi {dto.CustomerName}, your refund of ₹{amountStr} for booking {bookingRef} is {dto.RefundStatus}.</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GenerateBookingReminder(BookingReminderRequestDto dto)
        {
            var bookingRef = $"PH-BK-{dto.BookingId}";
            var eventDateStr = dto.EventDate.ToString("dd MMM yyyy, hh:mm tt");
            var bookingUrl = !string.IsNullOrWhiteSpace(dto.BookingUrl) ? dto.BookingUrl : "https://www.photohubconnect.store/client/bookings";

            var waTemplate = "event_reminder";
            var waParams = new List<string>
            {
                dto.CustomerName,
                dto.PhotographerName,
                eventDateStr,
                dto.Location,
                bookingUrl
            };

            var smsText = $"PhotoHub Connect: Reminder for your photoshoot with {dto.PhotographerName} on {eventDateStr}. Location: {dto.Location}. View: {bookingUrl}";
            var smsVars = new Dictionary<string, string>
            {
                { "customer_name", dto.CustomerName },
                { "photographer_name", dto.PhotographerName },
                { "event_date", eventDateStr },
                { "location", dto.Location }
            };

            var subject = $"⏰ Upcoming Photoshoot Reminder [{bookingRef}]";
            var htmlBody = $"<p>Hi {dto.CustomerName}, reminder: your shoot with {dto.PhotographerName} is scheduled for {eventDateStr} at {dto.Location}.</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }

        public static (string WhatsAppTemplate, List<string> WhatsAppParams, string SmsText, Dictionary<string, string> SmsVars, string Subject, string HtmlBody)
            GenerateOtp(OtpVerificationNotificationDto dto)
        {
            var waTemplate = "otp_verification";
            var waParams = new List<string>
            {
                dto.CustomerName,
                dto.OtpCode,
                dto.ExpiryMinutes.ToString()
            };

            var smsText = $"PhotoHub Connect: Your verification OTP is {dto.OtpCode}. Valid for {dto.ExpiryMinutes} minutes. Do not share this with anyone.";
            var smsVars = new Dictionary<string, string>
            {
                { "otp_code", dto.OtpCode },
                { "expiry_minutes", dto.ExpiryMinutes.ToString() }
            };

            var subject = "🔐 PhotoHub Connect - Verification OTP";
            var htmlBody = $"<p>Your verification code is <strong>{dto.OtpCode}</strong>. Valid for {dto.ExpiryMinutes} minutes.</p>";

            return (waTemplate, waParams, smsText, smsVars, subject, htmlBody);
        }
    }
}
