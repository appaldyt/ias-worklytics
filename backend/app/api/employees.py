from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Optional
from app.core.database import get_db
from app.models.employee import Employee, Department, Workload
from app.schemas.employee import (
    EmployeeCreate, EmployeeUpdate, EmployeeResponse,
    DepartmentCreate, DepartmentResponse,
    WorkloadCreate, WorkloadUpdate, WorkloadResponse,
    EmployeeWorkloadStats, DepartmentWorkloadStats
)

router = APIRouter()

# Employee endpoints
@router.post("/employees", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Membuat karyawan baru"""
    # Check if employee_id already exists
    db_employee = db.query(Employee).filter(Employee.employee_id == employee.employee_id).first()
    if db_employee:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.get("/employees", response_model=List[EmployeeResponse])
def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    department_id: Optional[int] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar karyawan"""
    query = db.query(Employee).filter(Employee.is_active == is_active)
    
    if department_id:
        query = query.filter(Employee.department_id == department_id)
    
    employees = query.offset(skip).limit(limit).all()
    return employees

@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Mendapatkan detail karyawan"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int, 
    employee_update: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    """Update data karyawan"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    for field, value in employee_update.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    return employee

# Department endpoints
@router.post("/departments", response_model=DepartmentResponse)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    """Membuat departemen baru"""
    db_department = Department(**department.model_dump())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    """Mendapatkan daftar departemen"""
    return db.query(Department).filter(Department.is_active == True).all()

# Workload endpoints
@router.post("/workloads", response_model=WorkloadResponse)
def create_workload(workload: WorkloadCreate, db: Session = Depends(get_db)):
    """Menambahkan beban kerja baru"""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == workload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db_workload = Workload(**workload.model_dump())
    db.add(db_workload)
    db.commit()
    db.refresh(db_workload)
    return db_workload

@router.get("/workloads", response_model=List[WorkloadResponse])
def get_workloads(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    employee_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar beban kerja"""
    query = db.query(Workload)
    
    if employee_id:
        query = query.filter(Workload.employee_id == employee_id)
    if status:
        query = query.filter(Workload.status == status)
    
    workloads = query.offset(skip).limit(limit).all()
    return workloads

@router.put("/workloads/{workload_id}", response_model=WorkloadResponse)
def update_workload(
    workload_id: int,
    workload_update: WorkloadUpdate,
    db: Session = Depends(get_db)
):
    """Update beban kerja"""
    workload = db.query(Workload).filter(Workload.id == workload_id).first()
    if not workload:
        raise HTTPException(status_code=404, detail="Workload not found")
    
    for field, value in workload_update.model_dump(exclude_unset=True).items():
        setattr(workload, field, value)
    
    db.commit()
    db.refresh(workload)
    return workload

# Analytics endpoints
@router.get("/analytics/employees", response_model=List[EmployeeWorkloadStats])
def get_employee_analytics(db: Session = Depends(get_db)):
    """Analisis beban kerja per karyawan"""
    results = db.query(
        Employee.id,
        Employee.name,
        func.count(Workload.id).label('total_tasks'),
        func.sum(case((Workload.status == 'completed', 1), else_=0)).label('completed_tasks'),
        func.sum(case((Workload.status == 'pending', 1), else_=0)).label('pending_tasks'),
        func.coalesce(func.sum(Workload.estimated_hours), 0).label('total_estimated'),
        func.coalesce(func.sum(Workload.actual_hours), 0).label('total_actual')
    ).outerjoin(Workload).group_by(Employee.id, Employee.name).all()
    
    analytics = []
    for result in results:
        efficiency = 0
        if result.total_estimated > 0 and result.total_actual > 0:
            efficiency = result.total_actual / result.total_estimated
            
        analytics.append(EmployeeWorkloadStats(
            employee_id=result.id,
            employee_name=result.name,
            total_tasks=result.total_tasks or 0,
            completed_tasks=result.completed_tasks or 0,
            pending_tasks=result.pending_tasks or 0,
            total_estimated_hours=result.total_estimated or 0,
            total_actual_hours=result.total_actual or 0,
            efficiency_rate=efficiency
        ))
    
    return analytics

@router.get("/analytics/departments", response_model=List[DepartmentWorkloadStats])
def get_department_analytics(db: Session = Depends(get_db)):
    """Analisis beban kerja per departemen"""
    # Simplified query to avoid join complexity
    departments = db.query(Department).filter(Department.is_active == True).all()
    
    analytics = []
    for dept in departments:
        # Count employees in department
        employee_count = db.query(Employee).filter(
            Employee.department_id == dept.id,
            Employee.is_active == True
        ).count()
        
        # Count tasks for this department
        task_count = db.query(Workload).join(Employee).filter(
            Employee.department_id == dept.id
        ).count()
        
        # Count completed tasks
        completed_count = db.query(Workload).join(Employee).filter(
            Employee.department_id == dept.id,
            Workload.status == 'completed'
        ).count()
        
        # Calculate metrics
        avg_workload = task_count / employee_count if employee_count > 0 else 0
        completion_rate = (completed_count * 100.0 / task_count) if task_count > 0 else 0
        
        analytics.append(DepartmentWorkloadStats(
            department_id=dept.id,
            department_name=dept.name,
            total_employees=employee_count,
            total_tasks=task_count,
            avg_workload_per_employee=avg_workload,
            completion_rate=completion_rate
        ))
    
    return analytics