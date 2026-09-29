require('dotenv').config();
const app = require('./app');
const config = require('./config/gateway');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 API Gateway is running on port ${PORT}`);
    console.log(`======================================`);
    console.log(`🌍 Environment Targets:`);
    console.log(`   - Java Service:   ${config.targets.java}`);
    console.log(`   - .NET Service:   ${config.targets.dotnet}`);
    console.log(`   - Python Service: ${config.targets.python}`);
    console.log(`======================================\n`);
});
