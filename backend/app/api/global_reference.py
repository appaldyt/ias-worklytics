from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.auth import require_role
from app.models.user import User
from app.models.global_reference import GlobalVerb
from app.schemas.global_reference import GlobalVerbCreate, GlobalVerbUpdate, GlobalVerbResponse

router = APIRouter()

@router.get('/global-verbs', response_model=List[GlobalVerbResponse])
def list_global_verbs(
    category: Optional[str] = None,
    level: Optional[str] = None,
    is_active: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(200, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin'))
):
    q = db.query(GlobalVerb)
    if category:
        q = q.filter(GlobalVerb.category == category)
    if level:
        q = q.filter(GlobalVerb.level == level)
    if is_active is not None:
        q = q.filter(GlobalVerb.is_active == is_active)
    return q.order_by(GlobalVerb.word.asc()).offset(skip).limit(limit).all()

@router.post('/global-verbs', response_model=GlobalVerbResponse)
def create_global_verb(
    payload: GlobalVerbCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin'))
):
    exists = db.query(GlobalVerb).filter(
        GlobalVerb.word == payload.word,
        GlobalVerb.category == payload.category,
        GlobalVerb.level == payload.level,
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail='Kata kerja sudah ada pada kategori/level ini')

    obj = GlobalVerb(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put('/global-verbs/{verb_id}', response_model=GlobalVerbResponse)
def update_global_verb(
    verb_id: int,
    payload: GlobalVerbUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin'))
):
    obj = db.query(GlobalVerb).filter(GlobalVerb.id == verb_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail='Data kata kerja tidak ditemukan')

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete('/global-verbs/{verb_id}')
def delete_global_verb(
    verb_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin'))
):
    obj = db.query(GlobalVerb).filter(GlobalVerb.id == verb_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail='Data kata kerja tidak ditemukan')
    db.delete(obj)
    db.commit()
    return {'message': 'Kata kerja berhasil dihapus'}

@router.post('/global-verbs/seed-default')
def seed_default_global_verbs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin'))
):
    seed_data = [
        ('Menyusun', 'strategis', 'kepala_divisi'),
        ('Merumuskan', 'strategis', 'kepala_divisi'),
        ('Mengkoordinasikan', 'manajerial', 'kepala_departemen'),
        ('Mengimplementasikan', 'manajerial', 'kepala_departemen'),
        ('Mengidentifikasi', 'spesialis', 'kepala_bagian'),
        ('Memeriksa', 'spesialis', 'staff'),
        ('Membantu', 'dilarang', 'all'),
        ('Mengamati', 'dilarang', 'all'),
        ('Mendelegasikan', 'dilarang', 'all'),
    ]

    created = 0
    for word, category, level in seed_data:
        exists = db.query(GlobalVerb).filter(
            GlobalVerb.word == word,
            GlobalVerb.category == category,
            GlobalVerb.level == level,
        ).first()
        if not exists:
            db.add(GlobalVerb(word=word, category=category, level=level, is_active=True))
            created += 1

    db.commit()
    return {'message': 'Seed completed', 'created': created}
