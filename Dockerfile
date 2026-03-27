# Multi-stage build untuk IAS Worklytics - Single Service
# Frontend (Next.js) + Backend (FastAPI) dalam satu container
# Created by Nusas for Shadow Monarch 🖤⚔️

# Stage 1: Build Frontend (Next.js)
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies
RUN apk add --no-cache libc6-compat
COPY frontend/package*.json ./
RUN npm ci

# Build Next.js
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Backend + Frontend
FROM python:3.11-slim AS production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application
COPY backend/ ./backend/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Create nginx configuration
RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
RUN rm -f /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/sites-enabled/default

# Create supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
RUN chown -R app:app /var/log/nginx
RUN chown -R app:app /var/lib/nginx

# Expose port 80 (nginx will handle routing)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/api/health || exit 1

# Start supervisor (manages nginx + fastapi + frontend)
USER root
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]