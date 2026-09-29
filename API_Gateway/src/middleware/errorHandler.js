/**
 * Global Error Handler for the API Gateway
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[Gateway Error] ${err.name}: ${err.message}`);
    console.error(err.stack);

    // Default error structure
    const status = err.status || err.statusCode || 500;
    const response = {
        error: {
            message: err.message || 'Internal Server Error at the API Gateway',
            status: status
        }
    };

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production') {
        response.error.stack = err.stack;
    }

    res.status(status).json(response);
};

module.exports = errorHandler;
