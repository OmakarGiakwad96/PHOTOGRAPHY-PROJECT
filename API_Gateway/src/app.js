const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const corsMiddleware = require('./middleware/cors');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const javaRoutes = require('./routes/java.routes');
const dotnetRoutes = require('./routes/dotnet.routes');
const pythonRoutes = require('./routes/python.routes');

const app = express();

// Security and Utility Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(logger);
app.use(corsMiddleware);

// Apply rate limiting globally or on specific routes
app.use('/api/', rateLimiter);

// Note: We DO NOT use express.json() globally here because http-proxy-middleware 
// needs the raw stream to forward multipart/form-data and body contents properly.
// If payload inspection is needed, it must be handled carefully.

// ==========================================
// Proxy Routes Registration
// ==========================================

// Register backend route handlers
javaRoutes(app);
dotnetRoutes(app);
pythonRoutes(app);

// Gateway specific health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'API Gateway' });
});

// 404 Fallback for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found on the API Gateway.' });
});

// Global Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
