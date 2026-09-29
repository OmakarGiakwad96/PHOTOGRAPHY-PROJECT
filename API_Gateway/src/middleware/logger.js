const morgan = require('morgan');

// Standard format for development, can be configured for production (e.g. 'combined')
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

// Skip logging for health checks to avoid noise
const skip = (req, res) => {
    return req.originalUrl.includes('/api/health');
};

const logger = morgan(format, { skip });

module.exports = logger;
