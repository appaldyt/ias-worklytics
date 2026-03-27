# 🏢 Multi-Tenant Environment Variables

## 🔧 **Production Environment Variables untuk EasyPanel**

Copy paste environment variables berikut ke EasyPanel:

```env
# Backend Configuration
ENVIRONMENT=production
DATABASE_URL=mysql+pymysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db
DEBUG=False
API_HOST=127.0.0.1
API_PORT=8000

# Frontend Configuration  
NODE_ENV=production
PORT=3000

# Domain Configuration
FRONTEND_URL=https://website-ias-worklytics.7jwomn.easypanel.host
NEXT_PUBLIC_API_URL=https://website-ias-worklytics.7jwomn.easypanel.host

# Authentication (Change in production!)
JWT_SECRET_KEY=ias-worklytics-secret-key-change-in-production-please
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🏢 **6 Tenant IAS Group yang Tersedia:**

1. **PT Integrasi Aviasi Solusi (IAS)** - Code: `IAS`
2. **PT Gapura Angkasa** - Code: `GAPURA`  
3. **PT IAS Support (IASS)** - Code: `IASS`
4. **PT IAS Hospitality (IASH)** - Code: `IASH`
5. **PT IAS Property (IASP)** - Code: `IASP`
6. **PT Angkasa Pura Support (APS1)** - Code: `APS1`

## 🔑 **Default Admin Credentials (Development):**

```
IAS:     admin_ias     / admin123
GAPURA:  admin_gapura  / admin123
IASS:    admin_iass    / admin123
IASH:    admin_iash    / admin123
IASP:    admin_iasp    / admin123
APS1:    admin_aps1    / admin123
```

## 🚀 **Cara Initialize Data:**

Setelah deployment, jalankan initialization:

```bash
# Via API endpoint
curl -X POST "https://website-ias-worklytics.7jwomn.easypanel.host/api/admin/tenants/init-default"

# Atau via script (jika akses container)
python backend/init_data.py
```

## 🌐 **URLs Setelah Deploy:**

- **Login Page**: https://website-ias-worklytics.7jwomn.easypanel.host/login
- **Dashboard**: https://website-ias-worklytics.7jwomn.easypanel.host/dashboard  
- **API Docs**: https://website-ias-worklytics.7jwomn.easypanel.host/docs
- **Health Check**: https://website-ias-worklytics.7jwomn.easypanel.host/api/health

## 🔐 **Security Notes:**

⚠️ **WAJIB GANTI di Production:**
- `JWT_SECRET_KEY` - ganti dengan key yang aman
- Default passwords semua admin users  
- Database credentials jika perlu

## 🧪 **Testing Multi-Tenant:**

1. Buka `/login`
2. Pilih perusahaan (tenant) 
3. Login dengan credentials admin
4. Dashboard akan menampilkan data spesifik tenant
5. Logout dan login ke tenant lain untuk test isolasi data

---

**Multi-tenant system ready! 🏢⚔️**