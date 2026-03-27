#!/bin/bash

# IAS Worklytics Deployment Helper Script
# Created by Nusas for Shadow Monarch 🖤⚔️

echo "🚀 IAS Worklytics Deployment Helper"
echo "=================================="

# Check if running in production mode
if [ "$1" = "prod" ]; then
    echo "📦 Building for production..."
    docker-compose -f docker-compose.prod.yml build
    
    echo "🚀 Starting production services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "🧪 Testing health endpoints..."
    sleep 10
    
    echo "Backend health check:"
    curl -f http://localhost:8000/api/health || echo "❌ Backend health check failed"
    
    echo -e "\nFrontend check:"
    curl -f http://localhost:3000 || echo "❌ Frontend check failed"
    
    echo -e "\n✅ Production deployment completed!"
    echo "📊 API Documentation: http://localhost:8000/docs"
    echo "🌐 Frontend: http://localhost:3000"
    
else
    echo "🛠️  Building for development..."
    docker-compose build
    
    echo "🚀 Starting development services..."
    docker-compose up -d
    
    echo "🧪 Testing health endpoints..."
    sleep 10
    
    echo "Backend health check:"
    curl -f http://localhost:8000/api/health || echo "❌ Backend health check failed"
    
    echo -e "\nFrontend check:"  
    curl -f http://localhost:3000 || echo "❌ Frontend check failed"
    
    echo -e "\n✅ Development environment ready!"
    echo "📊 API Documentation: http://localhost:8000/docs"  
    echo "🌐 Frontend: http://localhost:3000"
fi

echo ""
echo "🔧 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Rebuild: docker-compose build --no-cache"