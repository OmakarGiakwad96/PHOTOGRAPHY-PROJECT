const createServiceProxy = require('../utils/proxy');
const config = require('../config/gateway');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (app) => {
    const javaProxy = createServiceProxy(config.targets.java, 'Java Backend');

    const javaRoutes = [
        '/api/auth',
        '/api/admin',
        '/api/bookings',
        '/api/clients',
        '/api/packages',
        '/api/photographers',
        '/api/portfolio',
        '/api/reviews'
    ];

    javaRoutes.forEach(route => {
        // Apply auth middleware if needed. We apply it here for all java routes 
        // as an example of token inspection before proxying.
        app.use(route, authMiddleware, javaProxy);
    });
};
