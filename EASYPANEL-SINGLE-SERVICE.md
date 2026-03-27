# 🚀 EasyPanel Single Service Deployment - IAS Worklytics

**Domain**: `https://website-ias-worklytics.7jwomn.easypanel.host/`

## 📋 Single Container Architecture

```
┌─────────────────────────────────────┐
│         NGINX (Port 80)             │
│  ┌─────────────┐  ┌─────────────┐   │
│  │   Next.js   │  │   FastAPI   │   │
│  │ (Port 3000) │  │ (Port 8000) │   │
│  └─────────────┘  └─────────────┘   │
│          │              │           │
│          └──────┬───────┘           │
│                 │                   │
│        MySQL Database               │
│   (website_ias-worklytics-db)       │
└─────────────────────────────────────┘
```

## 🔧 EasyPanel Setup

### **Create New App:**
- **Name**: `ias-worklytics`
- **Source**: GitHub Repository
- **Repository**: `appaldyt/ias-worklytics`
- **Branch**: `main`
- **Build Path**: `.` (root)
- **Dockerfile**: `Dockerfile` (root level)

### **Port Configuration:**
- **Container Port**: 80
- **External Port**: 80 (or 443 for HTTPS)

### **Domain Configuration:**
- **Custom Domain**: `website-ias-worklytics.7jwomn.easypanel.host`
- **SSL/TLS**: Enable automatic certificate

## 🔧 Environment Variables

Copy dan paste ke EasyPanel Environment Variables:

```env
ENVIRONMENT=production
DATABASE_URL=mysql+pymysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db
DEBUG=False
NODE_ENV=production
FRONTEND_URL=https://website-ias-worklytics.7jwomn.easypanel.host
NEXT_PUBLIC_API_URL=https://website-ias-worklytics.7jwomn.easypanel.host
```

## 🧪 Testing After Deployment

### **Frontend Test:**
```bash
curl https://website-ias-worklytics.7jwomn.easypanel.host/
# Expected: HTML page dengan IAS Worklytics dashboard
```

### **Backend API Test:**
```bash
curl https://website-ias-worklytics.7jwomn.easypanel.host/api/health
# Expected: {"message":"IAS Worklytics API is running successfully! 🚀"}
```

### **API Documentation:**
- **Swagger UI**: https://website-ias-worklytics.7jwomn.easypanel.host/docs
- **ReDoc**: https://website-ias-worklytics.7jwomn.easypanel.host/redoc

### **Database Test:**
```bash
curl https://website-ias-worklytics.7jwomn.easypanel.host/api/departments
# Expected: [] (empty array initially)
```

## 🔄 Service Architecture

**Nginx Routes:**
- `/` → Next.js Frontend (Port 3000)
- `/api/*` → FastAPI Backend (Port 8000)
- `/docs` → API Documentation
- `/redoc` → Alternative API docs

**All services managed by Supervisor:**
- `backend` - FastAPI application
- `frontend` - Next.js application  
- `nginx` - Reverse proxy & routing

## 🚨 Health Checks

**Container Health Check:**
- Endpoint: `/api/health`
- Interval: 30 seconds
- Timeout: 3 seconds
- Retries: 3

**Manual Health Checks:**
- Nginx: `/nginx-health`
- Backend: `/api/health`
- Frontend: `/` (should load dashboard)

## 🛠️ Troubleshooting

### **Build Issues:**
1. Check build logs dalam EasyPanel
2. Verify Dockerfile path is correct (root level)
3. Ensure all required files exist in repository

### **Runtime Issues:**
1. Check container logs for supervisor processes
2. Verify database connection: `DATABASE_URL` format
3. Check nginx routing configuration

### **Database Connection Issues:**
1. Verify MySQL service is running
2. Test connection string manually
3. Check network connectivity between containers

---

**Single service deployment ready!** 🔥  
**Created by Nusas for Shadow Monarch** 🖤⚔️