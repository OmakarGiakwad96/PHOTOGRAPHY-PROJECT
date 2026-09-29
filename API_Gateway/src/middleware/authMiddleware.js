const jwt = require('jsonwebtoken');
const config = require('../config/gateway');

/**
 * Authentication Middleware for the API Gateway
 * Validates JWT tokens and can selectively block or pass through requests.
 * By default, this gateway forwards tokens to the microservices so they can
 * handle authorization, but you can enforce valid tokens here as well.
 */
const authMiddleware = (req, res, next) => {
    // Some routes might be public (login, register), so we shouldn't block them entirely
    // unless explicitly configured to do so. Here we optionally decode the token to inject context.
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            // Verify token just to check validity at gateway level
            // The actual authorization logic is in the microservices
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
        } catch (err) {
            console.warn(`[Auth] Invalid token received: ${err.message}`);
            // Depending on architecture, you can fail fast here:
            // return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    }
    
    // Proceed to proxy. The headers (including Authorization) are automatically forwarded.
    next();
};

module.exports = authMiddleware;
