# 🚀 EasyPanel Deployment Guide - IAS Worklytics

## 📋 Prerequisites

- EasyPanel account dengan akses ke MySQL database
- GitHub repository: `https://github.com/appaldyt/ias-worklytics`
- Database MySQL sudah running: `website_ias-worklytics-db`

## 🔧 Deployment Steps

### 1. **Backend Deployment (FastAPI)**

**Create New App in EasyPanel:**
- **Name**: `ias-worklytics-backend`
- **Source**: GitHub Repository
- **Repository**: `appaldyt/ias-worklytics`
- **Branch**: `main`
- **Build Path**: `backend/`
- **Dockerfile**: `backend/Dockerfile`

**Environment Variables:**
```env
ENVIRONMENT=production
DATABASE_URL=mysql+pymysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db
DEBUG=False
API_HOST=0.0.0.0
API_PORT=8000
```

**Port Configuration:**
- **Container Port**: 8000
- **External Port**: 8000

### 2. **Frontend Deployment (Next.js)**

**Create New App in EasyPanel:**
- **Name**: `ias-worklytics-frontend`  
- **Source**: GitHub Repository
- **Repository**: `appaldyt/ias-worklytics`
- **Branch**: `main`
- **Build Path**: `frontend/`
- **Dockerfile**: `frontend/Dockerfile`

**Environment Variables:**
```env
NODE_ENV=production
API_URL=https://[BACKEND_DOMAIN]
FRONTEND_URL=https://[FRONTEND_DOMAIN]
```

**Port Configuration:**
- **Container Port**: 3000
- **External Port**: 3000

### 3. **Domain & SSL Setup**

**Backend:**
- Set custom domain (e.g., `api.ias-worklytics.yourdomain.com`)
- Enable SSL/TLS certificate

**Frontend:** 
- Set custom domain (e.g., `ias-worklytics.yourdomain.com`)
- Enable SSL/TLS certificate

### 4. **Database Connection Test**

After deployment, test database connectivity:
```bash
curl https://[BACKEND_DOMAIN]/api/health
curl https://[BACKEND_DOMAIN]/api/departments
```

## 🧪 **Post-Deployment Testing**

### API Health Check:
```bash
curl https://[BACKEND_DOMAIN]/api/health
# Expected: {"message":"IAS Worklytics API is running successfully! 🚀"}
```

### Database Connectivity:
```bash
curl https://[BACKEND_DOMAIN]/api/departments
# Expected: [] (empty array if no departments created yet)
```

### Frontend Integration:
- Visit `https://[FRONTEND_DOMAIN]`
- Check "Status Koneksi API" section
- Should show green "API Terhubung" status

## 📊 **API Documentation**

Once deployed, API documentation will be available at:
- **Swagger UI**: `https://[BACKEND_DOMAIN]/docs`
- **ReDoc**: `https://[BACKEND_DOMAIN]/redoc`

## 🔄 **Auto-Deployment**

EasyPanel will automatically redeploy when changes are pushed to GitHub `main` branch.

## 🚨 **Environment Security**

**✅ Safe (already configured):**
- Database credentials via environment variables
- `.env` files excluded from repository
- Production-optimized Docker builds
- Non-root user containers

## 🛠️ **Troubleshooting**

### Database Connection Issues:
1. Verify DATABASE_URL format
2. Check MySQL service status in EasyPanel
3. Ensure network connectivity between containers

### Frontend API Connection Issues:
1. Verify API_URL points to correct backend domain
2. Check CORS settings in backend
3. Ensure both services are running

### Build Failures:
1. Check build logs in EasyPanel
2. Verify Dockerfile paths and syntax
3. Ensure all dependencies are in requirements.txt/package.json

---

**Deployment ready! 🔥**  
**Created by Nusas for Shadow Monarch** 🖤⚔️