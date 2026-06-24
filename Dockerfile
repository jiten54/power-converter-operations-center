# Multi-stage build for CERN-inspired Power Converter Operations Center
# Stage 1: Build the frontend and backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy full source
COPY . .

# Build Vite static assets and bundle server.ts with esbuild
RUN npm run build

# Stage 2: Run-time environment
FROM node:20-alpine

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the designated web port
EXPOSE 3000

# Start the bundled Express application
CMD ["node", "dist/server.cjs"]
