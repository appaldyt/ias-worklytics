import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database settings
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://Admin:Admin123@website_ias-worklytics-db:3306/ias-worklytics-db"
    )
    
    # For local development - use SQLite
    LOCAL_DATABASE_URL: str = "sqlite:///./ias_worklytics_local.db"
    
    # API settings
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Frontend settings
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Environment detection
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, production
    
    @property
    def database_url(self) -> str:
        """Get appropriate database URL based on environment"""
        if self.ENVIRONMENT == "production":
            return self.DATABASE_URL
        else:
            return self.LOCAL_DATABASE_URL

settings = Settings()