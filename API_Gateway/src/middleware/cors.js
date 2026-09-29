const cors = require('cors');

/**
 * CORS configuration for the API Gateway
 * In production (Vercel), all services share the same domain so origin is flexible.
 * In development, allows localhost origins.
 */
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174'
];

// In production on Vercel, allow the Vercel domain dynamically
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (internal service-to-service, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow all Vercel domains and localhost
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.vercel.sh')) {
            return callback(null, true);
        }
        // In production, also allow if VERCEL_URL env is set
        if (process.env.VERCEL_URL && origin.includes(process.env.VERCEL_URL)) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive for now; tighten in production
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);

