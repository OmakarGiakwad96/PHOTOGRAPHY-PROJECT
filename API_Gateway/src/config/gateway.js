module.exports = {
    port: process.env.PORT || 8000,
    jwtSecret: process.env.JWT_SECRET || 'photography-secret',
    targets: {
        java: process.env.JAVA_SERVICE || 'http://localhost:8086',
        dotnet: process.env.DOTNET_SERVICE || 'http://localhost:5000',
        python: process.env.PYTHON_SERVICE || 'http://localhost:8001',
    }
};
