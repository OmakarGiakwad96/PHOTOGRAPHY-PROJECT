const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for the React frontend
app.use(morgan('dev')); // Basic HTTP request logging

// ==========================================
// Proxy Configurations
// ==========================================

const javaTarget = process.env.JAVA_TARGET || 'http://localhost:8086';
const dotnetTarget = process.env.DOTNET_TARGET || 'http://localhost:5000';
const pythonTarget = process.env.PYTHON_TARGET || 'http://localhost:8000';

// Routes for Java Backend (Spring Boot)
const javaRoutes = [
    '/api/auth',
    '/api/admin',
    '/api/bookings',
    '/api/clients',
    '/api/packages',
    '/api/photographers',
    '/api/portfolio',
    '/api/reviews',
    '/api/users' // Explicitly added for the frontend usage
];

// Routes for .NET Backend (ASP.NET Core)
const dotnetRoutes = [
    '/api/payments',
    '/api/refunds',
    '/api/invoices',
    '/api/notifications',
    '/api/feedback',
    '/api/complaints',
    '/api/support',
    '/api/payment-issues', // Explicitly added for the frontend usage
    '/api/analytics'       // Explicitly added for the frontend usage
];

// Proxy function creator
const createProxy = (target) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        timeout: 15000, // 15 seconds timeout
        proxyTimeout: 15000,
        onError: (err, req, res) => {
            console.error(`Proxy Error to ${target}:`, err.message);
            if (!res.headersSent) {
                res.status(502).json({ error: `Backend service at ${target} is unreachable via the API Gateway.` });
            }
        }
    });
};

// Apply proxies
javaRoutes.forEach(route => {
    app.use(route, createProxy(javaTarget));
});

dotnetRoutes.forEach(route => {
    app.use(route, createProxy(dotnetTarget));
});

// Assuming Python GenAI service routes start with /api/python or similar
// Let's add a general rule for it if needed, or keep it explicitly mapped
app.use('/api/python', createProxyMiddleware({
    target: pythonTarget,
    changeOrigin: true,
    pathRewrite: { '^/api/python': '' },
    onError: (err, req, res) => {
        console.error('Proxy Error (Python Backend):', err.message);
        res.status(502).json({ error: 'Python GenAI Service is currently unreachable.' });
    }
}));

// ==========================================
// Base Routes & Fallbacks
// ==========================================

// Endpoint to ping all services and return their status
app.get('/api/status', async (req, res) => {
    const checkService = async (url, name) => {
        try {
            // Add a timeout of 2 seconds for the status check
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            // We just ping the root or health endpoint, expecting *any* response (even 404) to mean the server is physically up
            await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return { name, url, status: 'Online', class: 'online' };
        } catch (error) {
            return { name, url, status: 'Offline', class: 'offline', error: error.message };
        }
    };

    const results = await Promise.all([
        checkService(javaTarget, 'Java Backend (Spring Boot)'),
        checkService(dotnetTarget, '.NET Backend (ASP.NET Core)'),
        checkService(pythonTarget, 'Python AI Service (Flask/FastAPI)')
    ]);

    res.json({ gateway: 'Online', services: results });
});

// HTML Page for Monitoring
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Gateway - Service Status</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; padding: 40px; margin: 0; }
            h1 { text-align: center; color: #4ade80; }
            .container { max-width: 800px; margin: 0 auto; background: #1e1e1e; padding: 20px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); }
            .service { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; margin: 10px 0; border-radius: 8px; background: #2a2a2a; border-left: 5px solid gray; }
            .service.online { border-left-color: #4ade80; }
            .service.offline { border-left-color: #ef4444; }
            .status-badge { padding: 5px 12px; border-radius: 9999px; font-weight: bold; font-size: 0.85rem; }
            .online .status-badge { background-color: rgba(74, 222, 128, 0.2); color: #4ade80; }
            .offline .status-badge { background-color: rgba(239, 68, 68, 0.2); color: #ef4444; }
            .url { font-family: monospace; color: #a1a1aa; font-size: 0.9rem; }
            .footer { text-align: center; margin-top: 20px; color: #a1a1aa; font-size: 0.85rem; }
            #last-updated { font-weight: bold; color: #fff; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌐 API Gateway Status Dashboard</h1>
            <p style="text-align: center;">Monitoring active microservices in real-time.</p>
            
            <div id="services-list">
                <div class="service" style="text-align: center; justify-content: center;">
                    Loading status...
                </div>
            </div>

            <div class="footer">
                Auto-refreshing every 3 seconds. Last checked: <span id="last-updated">--</span>
            </div>
        </div>

        <script>
            async function fetchStatus() {
                try {
                    const response = await fetch('/api/status');
                    const data = await response.json();
                    
                    const listContainer = document.getElementById('services-list');
                    listContainer.innerHTML = '';
                    
                    // Add Gateway Status
                    listContainer.innerHTML += \`
                        <div class="service online">
                            <div>
                                <strong>API Gateway (Node.js)</strong><br>
                                <span class="url">http://localhost:${PORT}</span>
                            </div>
                            <span class="status-badge">Online</span>
                        </div>
                    \`;

                    // Add Microservices
                    data.services.forEach(service => {
                        listContainer.innerHTML += \`
                            <div class="service \${service.class}">
                                <div>
                                    <strong>\${service.name}</strong><br>
                                    <span class="url">\${service.url}</span>
                                </div>
                                <span class="status-badge">\${service.status}</span>
                            </div>
                        \`;
                    });

                    document.getElementById('last-updated').innerText = new Date().toLocaleTimeString();
                } catch (error) {
                    console.error('Failed to fetch status', error);
                }
            }

            // Fetch immediately, then every 3 seconds
            fetchStatus();
            setInterval(fetchStatus, 3000);
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// Simple health check endpoint for the gateway itself
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API Gateway is up and running smoothly!' });
});

// Fallback for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found. Please check your API Gateway URL path.' });
});

// Start the gateway server
app.listen(PORT, () => {
    console.log(`\n🚀 Central API Gateway is running on http://localhost:${PORT}`);
    console.log(`\nActive Proxies:`);
    console.log(`➡️  Java proxying to:   ${javaTarget}`);
    console.log(`➡️  .NET proxying to:   ${dotnetTarget}`);
    console.log(`➡️  Python proxying to: ${pythonTarget}`);
    console.log(`\nHealth Check:   http://localhost:${PORT}/health\n`);
});
