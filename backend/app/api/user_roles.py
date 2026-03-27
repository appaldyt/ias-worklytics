from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import require_role, get_password_hash
from app.models.user import User, UserTenantAccess
from app.models.tenant import Tenant
from app.schemas.user_management import UserMgmtCreate, UserMgmtUpdate, UserMgmtResponse

router = APIRouter()

@router.get('/users', response_model=List[UserMgmtResponse])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(require_role('super_admin'))):
    users = db.query(User).all()
    result = []
    for u in users:
        accesses = db.query(UserTenantAccess).filter(UserTenantAccess.user_id == u.id).all()
        result.append(UserMgmtResponse(
            id=u.id,
            username=u.username,
            email=u.email,
            full_name=u.full_name,
            role=u.role,
            tenant_id=u.tenant_id,
            tenant_access_ids=[a.tenant_id for a in accesses],
            is_active=u.is_active,
            created_at=u.created_at,
        ))
    return result

@router.post('/users', response_model=UserMgmtResponse)
def create_user(payload: UserMgmtCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role('super_admin'))):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail='Username already exists')
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail='Email already exists')

    default_tenant = db.query(Tenant).filter(Tenant.id == payload.default_tenant_id).first()
    if not default_tenant:
        raise HTTPException(status_code=404, detail='Default tenant not found')

    user = User(
        username=payload.username,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        tenant_id=payload.default_tenant_id,
        role=payload.role,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_ids = set(payload.tenant_access_ids or [])
    access_ids.add(payload.default_tenant_id)

    for tid in access_ids:
        if db.query(Tenant).filter(Tenant.id == tid).first():
            db.add(UserTenantAccess(user_id=user.id, tenant_id=tid))

    db.commit()

    return UserMgmtResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        tenant_id=user.tenant_id,
        tenant_access_ids=list(access_ids),
        is_active=user.is_active,
        created_at=user.created_at,
    )

@router.put('/users/{user_id}', response_model=UserMgmtResponse)
def update_user(user_id: int, payload: UserMgmtUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role('super_admin'))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    data = payload.model_dump(exclude_unset=True)
    access_ids = data.pop('tenant_access_ids', None)

    for k, v in data.items():
        if k == 'default_tenant_id':
            setattr(user, 'tenant_id', v)
        else:
            setattr(user, k, v)

    db.commit()
    db.refresh(user)

    if access_ids is not None:
        db.query(UserTenantAccess).filter(UserTenantAccess.user_id == user.id).delete()
        ids = set(access_ids)
        ids.add(user.tenant_id)
        for tid in ids:
            if db.query(Tenant).filter(Tenant.id == tid).first():
                db.add(UserTenantAccess(user_id=user.id, tenant_id=tid))
        db.commit()

    accesses = db.query(UserTenantAccess).filter(UserTenantAccess.user_id == user.id).all()

    return UserMgmtResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        tenant_id=user.tenant_id,
        tenant_access_ids=[a.tenant_id for a in accesses],
        is_active=user.is_active,
        created_at=user.created_at,
    )

@router.delete('/users/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role('super_admin'))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    user.is_active = False
    db.commit()
    return {'message': 'User deactivated'}

@router.get('/tenant-options')
def tenant_options(db: Session = Depends(get_db), current_user: User = Depends(require_role('super_admin'))):
    tenants = db.query(Tenant).filter(Tenant.is_active == True).all()
    return [{'id': t.id, 'name': t.name, 'code': t.code} for t in tenants]
