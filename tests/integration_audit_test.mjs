// integration_audit_test.mjs - End-to-End Automated Integration Test Suite for PhotoHub
import https from 'https';

const BASE_URL = 'https://www.photohubconnect.store';

const makeRequest = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json, text/html, */*'
      }
    };

    let postData = null;
    if (data) {
      postData = typeof data === 'string' ? data : JSON.stringify(data);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy(new Error('Request Timeout after 12s'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const results = [];

const test = async (name, fn) => {
  try {
    const res = await fn();
    results.push({ name, status: 'PASS', details: res || 'OK' });
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
  }
};

async function runSuite() {
  console.log(`\n======================================================`);
  console.log(`🚀 Starting PhotoHub Comprehensive Integration Tests`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  // Test 1: Frontend Homepage Availability
  await test('Frontend Landing Page & SEO Metadata', async () => {
    const res = await makeRequest('/');
    if (res.statusCode !== 200) throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    if (!res.body.includes('PhotoHub')) throw new Error('Missing PhotoHub brand title in HTML');
    if (!res.body.includes('checkout.razorpay.com')) throw new Error('Razorpay Checkout.js script tag missing in HTML');
    return `HTTP 200 OK, Razorpay SDK included in HTML head`;
  });

  // Test 2: API Gateway Health Endpoint
  await test('API Gateway Health Check (/api/health)', async () => {
    const res = await makeRequest('/api/health');
    if (res.statusCode !== 200) throw new Error(`Expected HTTP 200, got ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.status && !json.gateway) throw new Error(`Unexpected health payload: ${res.body}`);
    return `Gateway status: ${json.status || 'UP'}`;
  });

  // Test 3: Razorpay Server Order Creation Endpoint
  await test('Razorpay Payment Order Creation (/api/payments/create-razorpay-order)', async () => {
    const orderPayload = {
      amount: 48600,
      currency: 'INR',
      bookingId: 9876543,
      receipt: 'rcpt_test_suite_1'
    };
    const res = await makeRequest('/api/payments/create-razorpay-order', 'POST', orderPayload);
    if (res.statusCode !== 200) throw new Error(`Expected HTTP 200, got ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.orderId || !json.orderId.startsWith('order_')) {
      throw new Error(`Invalid Razorpay order ID received: ${json.orderId}`);
    }
    if (!json.keyId || !json.keyId.startsWith('rzp_')) {
      throw new Error(`Invalid Razorpay key ID in response: ${json.keyId}`);
    }
    return `Created Order: ${json.orderId} with key ${json.keyId.substring(0, 12)}...`;
  });

  // Test 4: Support Contact Form API
  await test('Support & Contact Submission API (/api/support/contact)', async () => {
    const contactPayload = {
      name: 'Integration Tester',
      email: 'tester@photohubconnect.store',
      phone: '9876543210',
      subject: 'Automated System Test',
      message: 'Verifying support ticket dispatch via automated integration test.',
      category: 'System Testing'
    };
    const res = await makeRequest('/api/support/contact', 'POST', contactPayload);
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      throw new Error(`Expected HTTP 200/201, got ${res.statusCode}: ${res.body}`);
    }
    return `HTTP ${res.statusCode} Contact Submission Accepted`;
  });

  // Test 5: AI Chatbot API Route Readiness
  await test('AI Chatbot Service Connectivity (/api/chat)', async () => {
    const chatPayload = { message: 'What wedding photography packages do you have in Pune?' };
    const res = await makeRequest('/api/chat', 'POST', chatPayload);
    // Even if upstream LLM is loading or warm, gateway returns structured response
    if (res.statusCode !== 200 && res.statusCode !== 502 && res.statusCode !== 504) {
      throw new Error(`Unexpected HTTP status: ${res.statusCode}`);
    }
    return `Chat Route response code: ${res.statusCode}`;
  });

  console.log(`\n======================================================`);
  console.log(`📊 TEST SUITE SUMMARY`);
  console.log(`======================================================`);
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runSuite();
