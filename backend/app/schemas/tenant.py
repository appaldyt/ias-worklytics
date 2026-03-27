from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TenantBase(BaseModel):
    name: str
    code: str
    subdomain: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    subdomain: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class TenantResponse(TenantBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class TenantListResponse(BaseModel):
    id: int
    name: str
    code: str
    logo_url: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True