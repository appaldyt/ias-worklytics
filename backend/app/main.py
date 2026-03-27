from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
from dotenv import load_dotenv

from app.api import health, employees, auth, tenants, user_roles
from app.core.database import engine
from app.models import employee, tenant, user

# Load environment variables
load_dotenv()

# Create database tables (only if connection is available)
try:
    # Create all tables
    employee.Base.metadata.create_all(bind=engine)
    tenant.Base.metadata.create_all(bind=engine) 
    user.Base.metadata.create_all(bind=engine)
    print("✅ Database connection successful and tables created!")
except Exception as e:
    print(f"⚠️ Database connection failed: {e}")
    print("App will start without database connection for development.")

# Create FastAPI app
app = FastAPI(
    title="IAS Worklytics API",
    description="API untuk Analisis Beban Kerja (ABK) IAS",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://localhost:3001",  # Next.js alt port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001", 
    os.getenv("FRONTEND_URL", ""),  # Production frontend URL
    "*"  # Allow all origins in development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(tenants.router, prefix="/api/admin", tags=["tenant-management"])
app.include_router(user_roles.router, prefix="/api/admin", tags=["user-role-management"])
app.include_router(employees.router, prefix="/api", tags=["employees"])

@app.get("/")
async def root():
    return {
        "message": "IAS Worklytics Multi-Tenant API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "status": "running",
        "features": [
            "Multi-tenant workload analytics",
            "User authentication & authorization", 
            "6 IAS Group companies support",
            "Employee & department management",
            "Real-time analytics dashboard"
        ],
        "endpoints": {
            "auth": "/api/auth/login",
            "tenants": "/api/auth/tenants",
            "docs": "/docs",
            "health": "/api/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )