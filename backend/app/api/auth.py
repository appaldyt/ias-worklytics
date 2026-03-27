from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.auth import (
    authenticate_user, get_password_hash, create_access_token, 
    create_refresh_token, get_current_user, get_current_tenant
)
from app.models.user import User, UserSession
from app.models.tenant import Tenant
from app.models.employee import Employee, Department, Workload
from app.schemas.auth import (
    LoginRequest, LoginResponse, UserCreate, UserResponse,
    TenantSelectionRequest, RefreshTokenRequest, UserStats, TenantStats
)
from app.schemas.tenant import TenantListResponse

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """User login with tenant selection"""
    
    # If tenant_code provided, get tenant_id
    tenant_id = None
    tenant = None
    
    if login_data.tenant_code:
        tenant = db.query(Tenant).filter(
            Tenant.code == login_data.tenant_code.upper(),
            Tenant.is_active == True
        ).first()
        
        if not tenant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tenant not found"
            )
        tenant_id = tenant.id
    
    # Authenticate user
    user = authenticate_user(db, login_data.username, login_data.password, tenant_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username, password, or tenant"
        )
    
    # If no tenant specified, but user has tenant, use it
    if not tenant:
        tenant = user.tenant
    
    # Create tokens
    token_data = {"user_id": user.id, "tenant_id": tenant.id}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Update last login
    user.last_login = datetime.utcnow()
    
    # Create user session
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    session = UserSession(
        user_id=user.id,
        tenant_id=tenant.id,
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    db.refresh(user)
    
    # Prepare response
    tenant_response = TenantListResponse(
        id=tenant.id,
        name=tenant.name,
        code=tenant.code,
        logo_url=tenant.logo_url,
        is_active=tenant.is_active
    )
    
    user_response = UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        tenant_id=user.tenant_id,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        created_at=user.created_at,
        last_login=user.last_login,
        tenant=tenant_response
    )
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=1800,  # 30 minutes
        user=user_response,
        tenant=tenant_response
    )

@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register new user (admin only in production)"""
    
    # Check if tenant exists
    tenant = db.query(Tenant).filter(Tenant.id == user_data.tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists in same tenant
    existing_email = db.query(User).filter(
        User.email == user_data.email,
        User.tenant_id == user_data.tenant_id
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered in this tenant"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        tenant_id=user_data.tenant_id,
        role=user_data.role,
        is_verified=True  # Auto-verify for now
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        tenant_id=user.tenant_id,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        created_at=user.created_at,
        last_login=user.last_login
    )

@router.get("/tenants", response_model=List[TenantListResponse])
def get_available_tenants(db: Session = Depends(get_db)):
    """Get list of available tenants for login"""
    tenants = db.query(Tenant).filter(Tenant.is_active == True).all()
    
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

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    
    tenant_response = TenantListResponse(
        id=current_user.tenant.id,
        name=current_user.tenant.name,
        code=current_user.tenant.code,
        logo_url=current_user.tenant.logo_url,
        is_active=current_user.tenant.is_active
    )
    
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        tenant_id=current_user.tenant_id,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        last_login=current_user.last_login,
        tenant=tenant_response
    )

@router.get("/dashboard/stats", response_model=UserStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    current_tenant: Tenant = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for current tenant"""
    
    # Get tenant statistics
    total_employees = db.query(Employee).filter(
        Employee.tenant_id == current_tenant.id,
        Employee.is_active == True
    ).count()
    
    total_departments = db.query(Department).filter(
        Department.tenant_id == current_tenant.id,
        Department.is_active == True
    ).count()
    
    total_workloads = db.query(Workload).filter(
        Workload.tenant_id == current_tenant.id
    ).count()
    
    active_workloads = db.query(Workload).filter(
        Workload.tenant_id == current_tenant.id,
        Workload.status.in_(["pending", "in_progress"])
    ).count()
    
    completed_workloads = db.query(Workload).filter(
        Workload.tenant_id == current_tenant.id,
        Workload.status == "completed"
    ).count()
    
    pending_workloads = db.query(Workload).filter(
        Workload.tenant_id == current_tenant.id,
        Workload.status == "pending"
    ).count()
    
    tenant_stats = TenantStats(
        total_employees=total_employees,
        total_departments=total_departments,
        total_workloads=total_workloads,
        active_workloads=active_workloads,
        completed_workloads=completed_workloads,
        pending_workloads=pending_workloads
    )
    
    return UserStats(
        tenant_stats=tenant_stats,
        user_role=current_user.role,
        last_login=current_user.last_login
    )

@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Logout current user"""
    
    # Deactivate all user sessions
    db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).update({"is_active": False})
    
    db.commit()
    
    return {"message": "Successfully logged out"}