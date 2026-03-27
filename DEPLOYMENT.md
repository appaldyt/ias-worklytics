# 🚀 IAS Worklytics - EasyPanel Deployment Guide

## Database Setup (Already Done ✅)

Database MySQL sudah di-setup di EasyPanel:
- **Host**: `website_ias-worklytics-db`  
- **Database**: `ias-worklytics-db`
- **User**: `Admin`
- **Password**: `Admin123`
- **Connection String**: `mysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db`

## Backend Deployment (FastAPI)

### 1. Create Backend Service di EasyPanel

**Service Type**: Docker
**Source**: Git Repository atau Upload folder `backend/`

### 2. Environment Variables
```env
ENVIRONMENT=production
DATABASE_URL=mysql+pymysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. Port Configuration
- **Container Port**: 8000
- **Public Port**: 8000 (atau custom)

### 4. Dockerfile
Backend sudah include `Dockerfile` yang production-ready dengan:
- Python 3.11 slim image
- MySQL dependencies
- Security best practices
- Health check endpoint

## Frontend Deployment (Next.js)

### 1. Create Frontend Service di EasyPanel

**Service Type**: Docker
**Source**: Git Repository atau Upload folder `frontend/`

### 2. Environment Variables
```env
NODE_ENV=production
API_URL=https://your-backend-domain.com
```

### 3. Port Configuration
- **Container Port**: 3000
- **Public Port**: 3000 (atau custom)

### 4. Build Configuration
Frontend menggunakan Next.js standalone build untuk optimized Docker deployment.

## Domain Setup

1. **Backend API**: Assign domain untuk backend service
   - Contoh: `https://api-ias-worklytics.yourdomain.com`

2. **Frontend App**: Assign domain untuk frontend service  
   - Contoh: `https://ias-worklytics.yourdomain.com`

3. **Update Environment Variables**: 
   - Set `FRONTEND_URL` di backend ke frontend domain
   - Set `API_URL` di frontend ke backend domain

## Database Migration

Saat pertama kali deploy, database tables akan auto-created oleh SQLAlchemy.

Untuk verify database connection:
```bash
curl https://your-backend-domain.com/api/health
```

## Testing Deployment

### 1. Health Check
```bash
# Backend health
curl https://your-backend-domain.com/api/health

# Frontend access  
curl https://your-frontend-domain.com
```

### 2. API Documentation
Akses Swagger UI: `https://your-backend-domain.com/docs`

### 3. Create Test Data
```bash
# Create department
curl -X POST "https://your-backend-domain.com/api/departments" \
  -H "Content-Type: application/json" \
  -d '{"name": "IT Department", "code": "IT001", "description": "Information Technology"}'

# Create employee
curl -X POST "https://your-backend-domain.com/api/employees" \
  -H "Content-Type: application/json" \
  -d '{"employee_id": "EMP001", "name": "John Doe", "email": "john@ias.com", "department_id": 1}'
```

## Monitoring

- **Backend Logs**: Check EasyPanel service logs for FastAPI
- **Frontend Logs**: Check EasyPanel service logs for Next.js
- **Database**: Monitor MySQL connections and queries

## Security Notes

- Database credentials sudah dikonfigurasi dengan environment variables
- CORS dikonfigurasi untuk allow frontend domain
- Production build menggunakan non-root user
- Health checks enabled

---

**Ready to deploy! 🚀 Semua files dan configurations sudah siap untuk EasyPanel deployment.**