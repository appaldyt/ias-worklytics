from fastapi import APIRouter
from datetime import datetime
from app.schemas.health import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint untuk memverifikasi bahwa API berjalan dengan baik
    """
    return HealthResponse(
        message="IAS Worklytics API is running successfully! 🚀",
        timestamp=datetime.now().isoformat(),
        version="1.0.0"
    )

@router.get("/status")
async def get_status():
    """
    Status endpoint dengan informasi detail
    """
    return {
        "api": "IAS Worklytics",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "description": "Analisis Beban Kerja (ABK) API",
        "endpoints": {
            "health": "/api/health",
            "status": "/api/status",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }