# web/Dockerfile
# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /web/app

# Copy package.json and lock file
COPY package.json ./
# If you use package-lock.json, yarn.lock, or pnpm-lock.yaml, ensure it's copied
COPY package-lock.json* ./
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# Ensure NEXT_PUBLIC_ variables are available during build if needed
RUN npm run build

# Stage 2: Setup Nginx and run the standalone Next.js app
FROM node:20-alpine AS runner
WORKDIR /web/app

# Install Nginx and Supervisor
RUN apk add --no-cache nginx supervisor

# Copy built app from builder stage
# The standalone output is in .next/standalone
COPY --from=builder /app/.next/standalone ./
# Standalone output also needs the public and .next/static folders for Nginx to serve them correctly
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 80 (for Nginx)
EXPOSE 80

# Start Supervisor, which will manage Nginx and the Node.js app
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
