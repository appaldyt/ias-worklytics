from pydantic import BaseModel
from datetime import datetime

class HealthResponse(BaseModel):
    message: str
    timestamp: str
    version: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "IAS Worklytics API is running successfully! 🚀",
                "timestamp": "2026-03-27T18:35:00.000000",
                "version": "1.0.0"
            }
        }