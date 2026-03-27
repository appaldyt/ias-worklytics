# IAS Worklytics - Single Service Container
# Frontend (Next.js) + Backend (FastAPI) + Nginx
# Created by Nusas for Shadow Monarch 🖤⚔️

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    nginx \
    supervisor \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies (Backend)
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application
COPY backend/ ./backend/

# Copy and build frontend
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm ci
RUN npm run build

# Back to app root
WORKDIR /app

# Copy nginx and supervisor configs
COPY nginx.conf /etc/nginx/sites-available/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/api/health || exit 1

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]