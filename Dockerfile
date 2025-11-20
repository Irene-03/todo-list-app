# Dockerfile for TODO Dashboard Application
# Phase 3: Docker Support

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create cert directory (for HTTPS certificates if needed)
RUN mkdir -p cert

# Expose ports
EXPOSE 3000 3443

# Environment variables (override with docker-compose or -e flag)
ENV NODE_ENV=production
ENV PORT=3000
ENV HTTPS_PORT=3443

# Start application
CMD ["node", "app.js"]
