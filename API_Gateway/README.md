# API Gateway for Photography Marketplace

This is a complete, production-ready API Gateway built with Node.js, Express, and `http-proxy-middleware`. It serves as the single entry point for all frontend requests, seamlessly routing traffic to the underlying microservices (Java, .NET, and Python).

## 🏗 Architecture Diagram

```mermaid
graph TD;
    Client[React Frontend] -->|http://localhost:8000/api| Gateway[API Gateway];
    Gateway -->|/api/auth, /api/bookings...| Java[Java Spring Boot (8086)];
    Gateway -->|/api/payments, /api/refunds...| DotNet[.NET ASP.NET Core (5000)];
    Gateway -->|/api/chat, /api/search...| Python[Python FastAPI (8001)];
```

## 📁 Folder Structure

```
API_Gateway/
├── src/
│   ├── config/          # Gateway configuration (ports, targets)
│   ├── middleware/      # Auth, CORS, Logger, Rate Limiter, Error Handling
│   ├── routes/          # Routing declarations for each backend
│   ├── utils/           # Proxy wrapper utility
│   ├── app.js           # Express app setup and middleware pipeline
│   └── server.js        # Entry point
├── .env                 # Environment variables
└── package.json
```

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up `.env`:**
   Ensure your `.env` file matches your backend service ports.

3. **Start the Gateway:**
   ```bash
   npm run dev    # For development (watch mode)
   npm start      # For production
   ```

## 🛤 How Routing Works

The gateway intelligently parses the incoming request path and routes it to the correct microservice based on predefined rules. 

- **Java Routes (`/api/auth`, `/api/admin`, `/api/bookings`, etc.)** \u2192 Routed to `http://localhost:8086`
- **.NET Routes (`/api/payments`, `/api/invoices`, `/api/support`, etc.)** \u2192 Routed to `http://localhost:5000`
- **Python Routes (`/api/chat`, `/api/image-analysis`, etc.)** \u2192 Routed to `http://localhost:8001`

All JWT Tokens, cookies, and necessary headers are securely forwarded to the respective backends.

## 🛡 Security \u0026 Middleware

- **Helmet**: Sets secure HTTP headers.
- **CORS**: Configured strictly to allow requests from the React frontend.
- **Rate Limiting**: Protects against DDoS and brute-force attacks.
- **Auth Middleware**: Extracts and forwards the JWT payload securely if needed.
- **Global Error Handler**: Catches proxy and server errors, returning clean JSON responses.

## 🌍 Environment Variables

```env
PORT=8000
JAVA_SERVICE=http://localhost:8086
DOTNET_SERVICE=http://localhost:5000
PYTHON_SERVICE=http://localhost:8001
JWT_SECRET=photography-secret
```
