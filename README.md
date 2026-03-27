# 🚀 IAS Worklytics

Aplikasi web untuk **Analisis Beban Kerja (ABK)** di IAS menggunakan Next.js dan FastAPI.

## 📋 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, Pydantic
- **Development**: Docker Compose
- **Future**: PostgreSQL (Phase 3), EasyPanel (Phase 2)

## 🏗️ Struktur Projek

```
ias-worklytics/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router
│   │   ├── components/   # React components
│   │   ├── lib/         # Utilities
│   │   └── types/       # TypeScript types
│   ├── package.json
│   └── next.config.js
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core configurations
│   │   ├── models/      # Database models (Phase 3)
│   │   ├── schemas/     # Pydantic schemas
│   │   └── main.py      # FastAPI app
│   ├── requirements.txt
│   └── .env
├── docker-compose.yml    # Development environment
├── devplan.md           # Development roadmap
└── devlog.md            # Development log
```

## 🚀 Quick Start

### Manual Development

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend Setup** (di terminal baru):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Akses Aplikasi**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Docker Development

```bash
# Build dan jalankan semua services
docker-compose up --build

# Hanya build (tanpa run)
docker-compose build

# Stop semua services
docker-compose down
```

## 📡 API Integration

Frontend Next.js sudah dikonfigurasi untuk proxy API calls ke FastAPI backend:

- Next.js route `/api/*` → FastAPI `http://localhost:8000/api/*`
- CORS sudah dikonfigurasi untuk allow `localhost:3000`
- Health check endpoint: `/api/health`

## 🧪 Testing Integration

1. Jalankan kedua aplikasi (frontend + backend)
2. Buka http://localhost:3000
3. Lihat status koneksi API di halaman utama
4. Jika berhasil, akan muncul pesan hijau "API Terhubung"

## 📡 Available API Endpoints

### Department Management
- `POST /api/departments` - Create department
- `GET /api/departments` - List departments

### Employee Management  
- `POST /api/employees` - Create employee
- `GET /api/employees` - List employees
- `GET /api/employees/{id}` - Get employee detail
- `PUT /api/employees/{id}` - Update employee

### Workload Management
- `POST /api/workloads` - Create workload
- `GET /api/workloads` - List workloads  
- `PUT /api/workloads/{id}` - Update workload

### Analytics (ABK Analysis)
- `GET /api/analytics/employees` - Employee workload statistics
- `GET /api/analytics/departments` - Department workload statistics

### System
- `GET /api/health` - Health check
- `GET /docs` - API documentation (Swagger UI)

## 📋 Development Phases

- ✅ **Phase 1**: Next.js + FastAPI Integration
- ✅ **Phase 3**: MySQL Database Integration (ABK Data Models)
- 🚀 **Phase 2**: EasyPanel Deployment (Ready!)
- ⏳ **Phase 4**: Advanced ABK Features

## 📝 Development Notes

- Lihat `devplan.md` untuk roadmap detail
- Lihat `devlog.md` untuk progress tracking
- API documentation tersedia di `/docs` (Swagger UI)
- All configurations sudah ready untuk production deployment

## 🚀 EasyPanel Deployment

Project sudah ready untuk production deployment! Lihat `DEPLOYMENT.md` untuk panduan lengkap.

**Database Connection (Production):**
```
mysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db
```

**Key Features Ready:**
- ✅ MySQL database integration dengan EasyPanel
- ✅ Docker production builds (frontend + backend)
- ✅ Environment variable configuration
- ✅ Health checks dan monitoring
- ✅ Complete ABK (Analisis Beban Kerja) system

## 🔧 Troubleshooting

- **CORS Error**: Pastikan backend running di port 8000
- **API Connection Failed**: Check backend status di http://localhost:8000/api/health
- **Port Conflict**: Ubah port di `docker-compose.yml` jika diperlukan
- **Database Error**: Pastikan MySQL service running (auto-handled in production)

---

**Dibuat dengan ❤️ oleh Nusas untuk Shadow Monarch** 🖤⚔️  
**Ready for production deployment! 🚀**