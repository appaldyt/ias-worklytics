#!/usr/bin/env python3
"""
Initialize default data for IAS Worklytics Multi-Tenant System
- Creates 6 IAS Group company tenants
- Creates default admin users for each tenant
- Creates sample departments and employees

Run: python init_data.py
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.tenant import Tenant
from app.models.user import User
from app.models.employee import Employee, Department
from app.core.auth import get_password_hash

def init_tenants(db: Session):
    """Initialize 6 IAS Group company tenants"""
    
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
            created_tenants.append(tenant)
            print(f"✅ Created tenant: {tenant_data['name']} ({tenant_data['code']})")
        else:
            created_tenants.append(existing)
            print(f"⚠️  Tenant already exists: {tenant_data['name']} ({tenant_data['code']})")
    
    db.commit()
    return created_tenants

def init_admin_users(db: Session, tenants):
    """Initialize admin users for each tenant + one super admin"""

    created_users = []

    # Global super admin
    super_admin_username = "superadmin"
    existing_super = db.query(User).filter(User.username == super_admin_username).first()
    if not existing_super and tenants:
        super_admin = User(
            username=super_admin_username,
            email="superadmin@ias.co.id",
            full_name="Super Administrator IAS Worklytics",
            hashed_password=get_password_hash("superadmin123"),
            tenant_id=tenants[0].id,
            role="super_admin",
            is_active=True,
            is_verified=True,
        )
        db.add(super_admin)
        created_users.append(super_admin)
        print("✅ Created super admin user: superadmin")

    for tenant in tenants:
        # Create admin user for each tenant
        username = f"admin_{tenant.code.lower()}"
        email = f"admin@{tenant.subdomain}.ias.co.id"
        
        # Check if user already exists
        existing_user = db.query(User).filter(
            User.username == username,
            User.tenant_id == tenant.id
        ).first()
        
        if not existing_user:
            admin_user = User(
                username=username,
                email=email,
                full_name=f"Administrator {tenant.name}",
                hashed_password=get_password_hash("admin123"),  # Change in production!
                tenant_id=tenant.id,
                role="admin",
                is_active=True,
                is_verified=True
            )
            
            db.add(admin_user)
            created_users.append(admin_user)
            print(f"✅ Created admin user: {username} for {tenant.name}")
        else:
            print(f"⚠️  Admin user already exists: {username} for {tenant.name}")
    
    db.commit()
    return created_users

def init_sample_departments(db: Session, tenants):
    """Initialize sample departments for each tenant"""
    
    # Standard departments for aviation companies
    standard_departments = [
        {"name": "Human Resources", "code": "HR", "description": "Human Resources Management"},
        {"name": "Finance & Accounting", "code": "FIN", "description": "Financial management and accounting"},
        {"name": "Operations", "code": "OPS", "description": "Operational activities and management"},
        {"name": "Information Technology", "code": "IT", "description": "IT systems and technology management"},
        {"name": "Safety & Quality", "code": "SQ", "description": "Safety protocols and quality assurance"}
    ]
    
    created_departments = []
    
    for tenant in tenants:
        print(f"Creating departments for {tenant.name}...")
        
        for dept_data in standard_departments:
            # Check if department already exists
            existing_dept = db.query(Department).filter(
                Department.code == dept_data["code"],
                Department.tenant_id == tenant.id
            ).first()
            
            if not existing_dept:
                department = Department(
                    tenant_id=tenant.id,
                    name=dept_data["name"],
                    code=dept_data["code"],
                    description=dept_data["description"]
                )
                
                db.add(department)
                created_departments.append(department)
                print(f"  ✅ Created department: {dept_data['name']} ({dept_data['code']})")
    
    db.commit()
    return created_departments

def init_sample_employees(db: Session, tenants):
    """Initialize sample employees for demonstration"""
    
    sample_employees = [
        {"employee_id": "EMP001", "name": "John Doe", "email": "john.doe@company.com", "position": "Manager"},
        {"employee_id": "EMP002", "name": "Jane Smith", "email": "jane.smith@company.com", "position": "Supervisor"},
        {"employee_id": "EMP003", "name": "Bob Johnson", "email": "bob.johnson@company.com", "position": "Staff"}
    ]
    
    created_employees = []
    
    for tenant in tenants:
        # Get first department for this tenant
        department = db.query(Department).filter(Department.tenant_id == tenant.id).first()
        
        if department:
            print(f"Creating sample employees for {tenant.name}...")
            
            for emp_data in sample_employees:
                # Check if employee already exists
                existing_emp = db.query(Employee).filter(
                    Employee.employee_id == emp_data["employee_id"],
                    Employee.tenant_id == tenant.id
                ).first()
                
                if not existing_emp:
                    employee = Employee(
                        tenant_id=tenant.id,
                        employee_id=emp_data["employee_id"],
                        name=emp_data["name"],
                        email=emp_data["email"].replace("@company.com", f"@{tenant.subdomain}.ias.co.id"),
                        position=emp_data["position"],
                        department_id=department.id
                    )
                    
                    db.add(employee)
                    created_employees.append(employee)
                    print(f"  ✅ Created employee: {emp_data['name']} ({emp_data['employee_id']})")
    
    db.commit()
    return created_employees

def main():
    """Initialize all default data"""
    print("🚀 IAS Worklytics Multi-Tenant Data Initialization")
    print("=" * 55)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Initialize tenants
        print("\n1. Initializing IAS Group Company Tenants...")
        tenants = init_tenants(db)
        
        # Initialize admin users
        print("\n2. Creating Admin Users...")
        admin_users = init_admin_users(db, tenants)
        
        # Initialize departments
        print("\n3. Creating Standard Departments...")
        departments = init_sample_departments(db, tenants)
        
        # Initialize sample employees
        print("\n4. Creating Sample Employees...")
        employees = init_sample_employees(db, tenants)
        
        print("\n" + "=" * 55)
        print("✅ INITIALIZATION COMPLETE!")
        print(f"📊 Created: {len(tenants)} tenants, {len(admin_users)} admin users")
        print(f"📊 Created: {len(departments)} departments, {len(employees)} employees")
        
        print("\n🔑 Default Credentials:")
        print("  • SUPER ADMIN (all tenants)")
        print("    Username: superadmin")
        print("    Password: superadmin123")
        print("    Email: superadmin@ias.co.id")
        print()
        for tenant in tenants:
            print(f"  • {tenant.name} ({tenant.code})")
            print(f"    Username: admin_{tenant.code.lower()}")
            print(f"    Password: admin123")
            print(f"    Email: admin@{tenant.subdomain}.ias.co.id")
            print()

        print("⚠️  SECURITY WARNING: Change default passwords in production!")
        print("🌐 Access: https://your-domain.com/")
        
    except Exception as e:
        print(f"❌ Error during initialization: {e}")
        db.rollback()
        raise
        
    finally:
        db.close()

if __name__ == "__main__":
    main()