const createServiceProxy = require('../utils/proxy');
const config = require('../config/gateway');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (app) => {
    const pythonProxy = createServiceProxy(config.targets.python, 'Python AI Service');

    const pythonRoutes = [
        '/api/chat',
        '/api/recommend',
        '/api/search',
        '/api/image-analysis',
        '/api/translation'
    ];

    pythonRoutes.forEach(route => {
        app.use(route, authMiddleware, pythonProxy);
    });
};
