from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    employee_id = Column(String(50), index=True, nullable=False)  # Unique per tenant
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True)  # Unique per tenant
    position = Column(String(255))
    department_id = Column(Integer, ForeignKey("departments.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="employees")
    department = relationship("Department", back_populates="employees")
    workloads = relationship("Workload", back_populates="employee")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(50), index=True)  # Unique per tenant
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="departments")
    employees = relationship("Employee", back_populates="department")

class Workload(Base):
    __tablename__ = "workloads"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    task_name = Column(String(255), nullable=False)
    task_description = Column(Text)
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    priority = Column(String(50), default="medium")  # low, medium, high, urgent
    status = Column(String(50), default="pending")  # pending, in_progress, completed, cancelled
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tenant = relationship("Tenant", back_populates="workloads")
    employee = relationship("Employee", back_populates="workloads")