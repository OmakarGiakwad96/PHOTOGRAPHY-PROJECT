const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Creates a configured http-proxy-middleware instance
 * @param {string} target - The backend URL to forward requests to
 * @param {string} serviceName - Used for logging purposes
 */
const createServiceProxy = (target, serviceName) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        timeout: 15000,      // 15 seconds request timeout
        proxyTimeout: 15000, // 15 seconds proxy connection timeout
        
        // This ensures headers like Authorization and cookies are forwarded
        xfwd: true, 
        
        // Express app.use() strips the mount path. We must rewrite it to the original URL
        pathRewrite: (path, req) => req.originalUrl,
        
        onProxyReq: (proxyReq, req, res) => {
            // Can inject additional headers here if needed
            // e.g., proxyReq.setHeader('x-gateway-processed', 'true');
        },
        
        onError: (err, req, res) => {
            console.error(`[Proxy Error] ${serviceName} unreachable: ${err.message}`);
            if (!res.headersSent) {
                res.status(502).json({ 
                    error: {
                        message: `${serviceName} is currently unreachable via the API Gateway.`,
                        status: 502
                    }
                });
            }
        }
    });
};

module.exports = createServiceProxy;
