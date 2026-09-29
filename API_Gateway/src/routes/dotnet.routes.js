const createServiceProxy = require('../utils/proxy');
const config = require('../config/gateway');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (app) => {
    const dotnetProxy = createServiceProxy(config.targets.dotnet, '.NET Backend');

    const dotnetRoutes = [
        '/api/payments',
        '/api/refunds',
        '/api/invoices',
        '/api/notifications',
        '/api/support',
        '/api/feedback',
        '/api/complaints'
    ];

    dotnetRoutes.forEach(route => {
        app.use(route, authMiddleware, dotnetProxy);
    });
};
