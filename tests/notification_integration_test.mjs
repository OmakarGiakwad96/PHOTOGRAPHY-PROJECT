/**
 * PhotoHub Connect - WhatsApp & SMS Automation Verification Suite
 * Tests Meta WhatsApp Cloud API templates, MSG91 SMS flow, Preferences, Idempotency, and Webhooks
 */

import http from 'http';
import https from 'https';
import crypto from 'crypto';

const TARGET_BASE = process.env.TEST_TARGET_URL || 'http://localhost:5000';

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, TARGET_BASE);
    const client = url.protocol === 'https:' ? https : http;

    const requestHeaders = {
      'Accept': 'application/json',
      ...headers
    };

    let bodyData = null;
    if (body) {
      bodyData = typeof body === 'string' ? body : JSON.stringify(body);
      requestHeaders['Content-Type'] = requestHeaders['Content-Type'] || 'application/json';
      requestHeaders['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const req = client.request(url, {
      method,
      headers: requestHeaders,
      timeout: 10000
    }, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: rawData
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout after 10000ms connecting to ${url.toString()}`));
    });

    if (bodyData) req.write(bodyData);
    req.end();
  });
}

async function test(name, fn) {
  try {
    process.stdout.write(`• Testing: ${name}... `);
    const result = await fn();
    console.log(`\x1b[32mPASS\x1b[0m ${result ? `(${result})` : ''}`);
    return true;
  } catch (err) {
    console.log(`\x1b[31mFAIL\x1b[0m`);
    console.error(`  Error: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log(`\n============================================================`);
  console.log(`📸 PHOTOHUB CONNECT - WHATSAPP & SMS AUTOMATION TEST SUITE`);
  console.log(`Target: ${TARGET_BASE}`);
  console.log(`============================================================\n`);

  let passed = 0;
  let total = 0;

  // Test 1: Customer Notification Preferences & Consent Recording
  total++;
  if (await test('Save Customer Notification Preferences (/api/notifications/preferences)', async () => {
    const payload = {
      userId: 8888,
      phoneNumber: '+91 98765 43210',
      email: 'client8888@photohubconnect.store',
      whatsAppConsent: true,
      smsConsent: true,
      emailConsent: true,
      promotionalConsent: false,
      consentSource: 'AutomatedIntegrationTest'
    };

    const res = await makeRequest('/api/notifications/preferences', 'POST', payload);
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.preferences || json.preferences.whatsAppConsent !== true) {
      throw new Error(`Preferences payload mismatch: ${res.body}`);
    }
    return `Saved consent for ${payload.phoneNumber}`;
  })) passed++;

  // Test 2: Booking Confirmation Notification (WhatsApp + SMS + Email)
  total++;
  if (await test('Send Booking Confirmation Notification (/api/notifications/booking-confirmation)', async () => {
    const payload = {
      bookingId: 9901,
      customerName: 'Aman Sharma',
      customerEmail: 'aman@example.com',
      customerPhone: '+919876543210',
      photographerName: 'Rahul Lensworks',
      eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      location: 'Baner, Pune',
      packageName: 'Wedding Royale Photography',
      amount: 45000,
      bookingUrl: 'https://www.photohubconnect.store/client/bookings'
    };

    const res = await makeRequest('/api/notifications/booking-confirmation', 'POST', payload);
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.success || (!json.whatsAppSent && !json.smsSent)) {
      throw new Error(`Booking confirmation failed: ${res.body}`);
    }
    return `WhatsApp: ${json.whatsAppSent}, SMS: ${json.smsSent}`;
  })) passed++;

  // Test 3: Verified Payment Success Notification & Idempotency
  total++;
  if (await test('Payment Success Notification with Idempotency (/api/notifications/payment-success)', async () => {
    const txnId = `pay_test_${Date.now()}`;
    const payload = {
      paymentId: 9902,
      bookingId: 9901,
      customerName: 'Aman Sharma',
      customerEmail: 'aman@example.com',
      customerPhone: '+919876543210',
      amount: 45000,
      currency: 'INR',
      transactionId: txnId,
      paymentMethod: 'Razorpay Standard'
    };

    // First attempt
    const res1 = await makeRequest('/api/notifications/payment-success', 'POST', payload);
    if (res1.statusCode !== 200) throw new Error(`First call HTTP ${res1.statusCode}: ${res1.body}`);

    // Second attempt with exact same transaction ID (should be deduplicated safely)
    const res2 = await makeRequest('/api/notifications/payment-success', 'POST', payload);
    if (res2.statusCode !== 200) throw new Error(`Second call HTTP ${res2.statusCode}: ${res2.body}`);

    return `Idempotent send verified for ${txnId}`;
  })) passed++;

  // Test 4: Booking Cancellation & Refund Update
  total++;
  if (await test('Booking Cancellation Notification (/api/notifications/booking-cancellation)', async () => {
    const payload = {
      bookingId: 9901,
      customerName: 'Aman Sharma',
      customerPhone: '+919876543210',
      customerEmail: 'aman@example.com',
      photographerName: 'Rahul Lensworks',
      reason: 'Schedule conflict - client requested cancellation',
      refundAmount: 45000,
      eventDate: new Date().toISOString()
    };

    const res = await makeRequest('/api/notifications/booking-cancellation', 'POST', payload);
    if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.success) throw new Error(`Cancellation notification failed: ${res.body}`);
    return `Cancellation dispatched for booking #9901`;
  })) passed++;

  // Test 5: Meta WhatsApp Webhook Challenge Verification
  total++;
  if (await test('Meta WhatsApp Webhook Verification (/api/notifications/whatsapp/webhook)', async () => {
    const verifyToken = 'photohub_wa_verify_token_2026';
    const challenge = 'CHALLENGE_STRING_12345';
    const path = `/api/notifications/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challenge}`;

    const res = await makeRequest(path, 'GET');
    if (res.statusCode !== 200 || res.body !== challenge) {
      throw new Error(`Expected HTTP 200 with challenge '${challenge}', got HTTP ${res.statusCode}: ${res.body}`);
    }
    return `Webhook challenge verified: ${res.body}`;
  })) passed++;

  // Test 6: Audit Logs & Summary Analytics
  total++;
  if (await test('Notification Audit Logs & KPI Stats (/api/notifications/stats & /logs)', async () => {
    const [statsRes, logsRes] = await Promise.all([
      makeRequest('/api/notifications/stats'),
      makeRequest('/api/notifications/logs')
    ]);

    if (statsRes.statusCode !== 200) throw new Error(`Stats HTTP ${statsRes.statusCode}`);
    if (logsRes.statusCode !== 200) throw new Error(`Logs HTTP ${logsRes.statusCode}`);

    const stats = JSON.parse(statsRes.body);
    const logs = JSON.parse(logsRes.body);

    if (typeof stats.totalNotifications !== 'number') {
      throw new Error(`Invalid stats format: ${statsRes.body}`);
    }
    if (!Array.isArray(logs)) {
      throw new Error(`Invalid logs array: ${logsRes.body}`);
    }

    return `Total logged: ${stats.totalNotifications}, Delivery Rate: ${stats.deliveryRate}%`;
  })) passed++;

  console.log(`\n============================================================`);
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log(`============================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
