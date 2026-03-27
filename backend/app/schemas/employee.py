from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum

class Priority(str, Enum):
    low = "low"
    medium = "medium" 
    high = "high"
    urgent = "urgent"

class Status(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

# Department schemas
class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_active: bool = True

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Employee schemas
class EmployeeBase(BaseModel):
    employee_id: str
    name: str
    email: Optional[EmailStr] = None
    position: Optional[str] = None
    department_id: Optional[int] = None
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    position: Optional[str] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    department: Optional[DepartmentResponse] = None

    class Config:
        from_attributes = True

# Workload schemas
class WorkloadBase(BaseModel):
    task_name: str
    task_description: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    priority: Priority = Priority.medium
    status: Status = Status.pending
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class WorkloadCreate(WorkloadBase):
    employee_id: int

class WorkloadUpdate(BaseModel):
    task_name: Optional[str] = None
    task_description: Optional[str] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class WorkloadResponse(WorkloadBase):
    id: int
    employee_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    employee: Optional[EmployeeResponse] = None

    class Config:
        from_attributes = True

# Analytics schemas
class EmployeeWorkloadStats(BaseModel):
    employee_id: int
    employee_name: str
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    total_estimated_hours: float
    total_actual_hours: float
    efficiency_rate: float  # actual/estimated ratio

class DepartmentWorkloadStats(BaseModel):
    department_id: int
    department_name: str
    total_employees: int
    total_tasks: int
    avg_workload_per_employee: float
    completion_rate: float