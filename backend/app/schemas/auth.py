from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from .tenant import TenantListResponse

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    tenant_id: int
    role: str = "karyawan"
    is_active: bool = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    tenant_id: int
    role: str = "karyawan"

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    tenant_id: int
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]
    tenant: Optional[TenantListResponse] = None

    class Config:
        from_attributes = True

# Authentication schemas
class LoginRequest(BaseModel):
    username: str
    password: str
    tenant_code: Optional[str] = None  # Optional for tenant selection

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse
    tenant: TenantListResponse

class TenantSelectionRequest(BaseModel):
    tenant_code: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr
    tenant_code: str

# Dashboard/Stats schemas
class TenantStats(BaseModel):
    total_employees: int
    total_departments: int
    total_workloads: int
    active_workloads: int
    completed_workloads: int
    pending_workloads: int

class UserStats(BaseModel):
    tenant_stats: TenantStats
    user_role: str
    last_login: Optional[datetime]