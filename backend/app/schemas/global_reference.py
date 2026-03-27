from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GlobalVerbCreate(BaseModel):
    word: str
    category: str = "spesialis"  # strategis | manajerial | spesialis | dilarang
    level: str = "staff"         # bod | kepala_divisi | kepala_departemen | kepala_bagian | staff
    description: Optional[str] = None
    is_active: bool = True

class GlobalVerbUpdate(BaseModel):
    word: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class GlobalVerbResponse(BaseModel):
    id: int
    word: str
    category: str
    level: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
