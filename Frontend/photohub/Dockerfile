# Stage 1: Build the React/Vite app
FROM node:20-alpine AS build
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy built files from the build stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html
# Create a custom nginx configuration to support React Router SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        resolver 127.0.0.11 valid=30s; \
        set $upstream http://api-gateway:3000; \
        proxy_pass $upstream; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    } \
}' > /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
