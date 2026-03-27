from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user, require_role, get_password_hash
from app.models.user import User
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantResponse, TenantUpdate, TenantListResponse

router = APIRouter()

@router.post("/tenants", response_model=TenantResponse)
def create_tenant(
    tenant_data: TenantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Create new tenant (super admin only)"""
    
    # Check if tenant code already exists
    existing_tenant = db.query(Tenant).filter(Tenant.code == tenant_data.code.upper()).first()
    if existing_tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant code already exists"
        )
    
    # Create tenant
    tenant = Tenant(
        name=tenant_data.name,
        code=tenant_data.code.upper(),
        subdomain=tenant_data.subdomain,
        logo_url=tenant_data.logo_url,
        description=tenant_data.description,
        is_active=tenant_data.is_active
    )
    
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    
    return tenant

@router.get("/tenants", response_model=List[TenantListResponse])
def get_tenants(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Get all tenants (super admin only)"""
    tenants = db.query(Tenant).offset(skip).limit(limit).all()
    
    return [
        TenantListResponse(
            id=tenant.id,
            name=tenant.name,
            code=tenant.code,
            logo_url=tenant.logo_url,
            is_active=tenant.is_active
        )
        for tenant in tenants
    ]

@router.get("/tenants/{tenant_id}", response_model=TenantResponse)
def get_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Get tenant by ID (super admin only)"""
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return tenant

@router.put("/tenants/{tenant_id}", response_model=TenantResponse)
def update_tenant(
    tenant_id: int,
    tenant_update: TenantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Update tenant (super admin only)"""
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Update fields
    for field, value in tenant_update.model_dump(exclude_unset=True).items():
        setattr(tenant, field, value)
    
    db.commit()
    db.refresh(tenant)
    
    return tenant

@router.delete("/tenants/{tenant_id}")
def delete_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("super_admin"))
):
    """Delete tenant (super admin only)"""
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Soft delete - just deactivate
    tenant.is_active = False
    db.commit()
    
    return {"message": f"Tenant {tenant.name} has been deactivated"}

@router.post("/tenants/init-default")
def initialize_default_tenants(
    db: Session = Depends(get_db)
):
    """Initialize default tenants - IAS Group companies"""
    
    default_tenants = [
        {
            "name": "PT Integrasi Aviasi Solusi (IAS)",
            "code": "IAS",
            "subdomain": "ias",
            "description": "PT Integrasi Aviasi Solusi - Parent company providing integrated aviation solutions"
        },
        {
            "name": "PT Gapura Angkasa",
            "code": "GAPURA",
            "subdomain": "gapura",
            "description": "PT Gapura Angkasa - Aviation ground handling services"
        },
        {
            "name": "PT IAS Support (IASS)",
            "code": "IASS",
            "subdomain": "iass",
            "description": "PT IAS Support - Aviation support services division"
        },
        {
            "name": "PT IAS Hospitality (IASH)",
            "code": "IASH",
            "subdomain": "iash",
            "description": "PT IAS Hospitality - Airport hospitality and passenger services"
        },
        {
            "name": "PT IAS Property (IASP)",
            "code": "IASP",
            "subdomain": "iasp",
            "description": "PT IAS Property - Airport property development and management"
        },
        {
            "name": "PT Angkasa Pura Support (APS1)",
            "code": "APS1",
            "subdomain": "aps1",
            "description": "PT Angkasa Pura Support - Airport operational support services"
        }
    ]
    
    created_tenants = []
    
    for tenant_data in default_tenants:
        # Check if tenant already exists
        existing = db.query(Tenant).filter(Tenant.code == tenant_data["code"]).first()
        
        if not existing:
            tenant = Tenant(**tenant_data)
            db.add(tenant)
            created_tenants.append(tenant_data["name"])
    
    db.commit()
    
    if created_tenants:
        return {
            "message": f"Successfully created {len(created_tenants)} tenants",
            "created": created_tenants
        }
    else:
        return {
            "message": "All default tenants already exist",
            "created": []
        }


@router.post("/tenants/bootstrap-users")
def bootstrap_default_users(db: Session = Depends(get_db)):
    """Create default super admin and tenant admins if not exists."""
    try:
        tenants = db.query(Tenant).filter(Tenant.is_active == True).all()
        if not tenants:
            raise HTTPException(status_code=400, detail="No tenants found. Run /tenants/init-default first.")

        created = []

        # Create global super admin
        existing_super = db.query(User).filter(User.username == "superadmin").first()
        if not existing_super:
            super_admin = User(
                username="superadmin",
                email="superadmin@ias.co.id",
                full_name="Super Administrator IAS Worklytics",
                hashed_password=get_password_hash("superadmin123"),
                tenant_id=tenants[0].id,
                role="super_admin",
                is_active=True,
                is_verified=True,
            )
            db.add(super_admin)
            created.append("superadmin")

        # Create admin for each tenant
        for tenant in tenants:
            username = f"admin_{tenant.code.lower()}"
            exists = db.query(User).filter(User.username == username, User.tenant_id == tenant.id).first()
            if not exists:
                subdomain = tenant.subdomain or tenant.code.lower()
                admin_user = User(
                    username=username,
                    email=f"admin@{subdomain}.ias.co.id",
                    full_name=f"Administrator {tenant.name}",
                    hashed_password=get_password_hash("admin123"),
                    tenant_id=tenant.id,
                    role="admin",
                    is_active=True,
                    is_verified=True,
                )
                db.add(admin_user)
                created.append(username)

        db.commit()

        return {
            "message": "Bootstrap users completed",
            "created_users": created,
            "total_created": len(created),
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"bootstrap-users failed: {str(e)}")