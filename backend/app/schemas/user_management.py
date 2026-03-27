from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserMgmtCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: str  # super_admin | admin | karyawan
    default_tenant_id: int
    tenant_access_ids: List[int] = []

class UserMgmtUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    default_tenant_id: Optional[int] = None
    tenant_access_ids: Optional[List[int]] = None
    is_active: Optional[bool] = None

class UserMgmtResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    tenant_id: int
    tenant_access_ids: List[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
