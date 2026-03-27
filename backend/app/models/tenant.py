from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # PT Integrasi Aviasi Solusi (IAS)
    code = Column(String(10), unique=True, index=True, nullable=False)  # IAS
    subdomain = Column(String(50), unique=True, index=True)  # ias.worklytics.com
    logo_url = Column(String(500))
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="tenant")
    departments = relationship("Department", back_populates="tenant")
    employees = relationship("Employee", back_populates="tenant")
    workloads = relationship("Workload", back_populates="tenant")