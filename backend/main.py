from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import date
import sqlite3
from contextlib import contextmanager

app = FastAPI(title="HRMS Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@contextmanager
def get_db():
    conn = sqlite3.connect('hrms.db')
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Initialize database
def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS employees (
                employee_id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                department TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.execute('''
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT NOT NULL,
                date TEXT NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('Present', 'Absent')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
                UNIQUE(employee_id, date)
            )
        ''')
        conn.commit()

init_db()

# Models
class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

class Attendance(BaseModel):
    employee_id: str
    date: str
    status: str

# Employee Endpoints
@app.get("/")
def root():
    return {"message": "HRMS Lite API", "version": "1.0.0"}

@app.get("/api/employees")
def get_employees():
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM employees ORDER BY created_at DESC")
        employees = [dict(row) for row in cursor.fetchall()]
    return employees

@app.get("/api/employees/{employee_id}")
def get_employee(employee_id: str):
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM employees WHERE employee_id = ?", (employee_id,))
        employee = cursor.fetchone()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return dict(employee)

@app.post("/api/employees", status_code=201)
def create_employee(employee: Employee):
    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO employees (employee_id, full_name, email, department) VALUES (?, ?, ?, ?)",
                (employee.employee_id, employee.full_name, employee.email, employee.department)
            )
            conn.commit()
        return {"message": "Employee created successfully", "employee_id": employee.employee_id}
    except sqlite3.IntegrityError as e:
        if "employee_id" in str(e):
            raise HTTPException(status_code=400, detail="Employee ID already exists")
        elif "email" in str(e):
            raise HTTPException(status_code=400, detail="Email already exists")
        raise HTTPException(status_code=400, detail="Failed to create employee")

@app.delete("/api/employees/{employee_id}")
def delete_employee(employee_id: str):
    with get_db() as conn:
        cursor = conn.execute("DELETE FROM employees WHERE employee_id = ?", (employee_id,))
        conn.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": "Employee deleted successfully"}

# Attendance Endpoints
@app.get("/api/attendance")
def get_attendance(employee_id: Optional[str] = None, date: Optional[str] = None):
    query = """
        SELECT a.*, e.full_name, e.department 
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
        WHERE 1=1
    """
    params = []
    
    if employee_id:
        query += " AND a.employee_id = ?"
        params.append(employee_id)
    
    if date:
        query += " AND a.date = ?"
        params.append(date)
    
    query += " ORDER BY a.date DESC, a.created_at DESC"
    
    with get_db() as conn:
        cursor = conn.execute(query, params)
        attendance = [dict(row) for row in cursor.fetchall()]
    
    return attendance

@app.get("/api/employees/{employee_id}/attendance")
def get_employee_attendance(employee_id: str):
    with get_db() as conn:
        # Verify employee exists
        cursor = conn.execute("SELECT * FROM employees WHERE employee_id = ?", (employee_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # Get attendance records
        cursor = conn.execute(
            """SELECT a.*, e.full_name 
               FROM attendance a
               JOIN employees e ON a.employee_id = e.employee_id
               WHERE a.employee_id = ? 
               ORDER BY a.date DESC""",
            (employee_id,)
        )
        attendance = [dict(row) for row in cursor.fetchall()]
    
    return attendance

@app.post("/api/attendance", status_code=201)
def mark_attendance(attendance: Attendance):
    # Validate employee exists
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM employees WHERE employee_id = ?", (attendance.employee_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # Validate status
        if attendance.status not in ["Present", "Absent"]:
            raise HTTPException(status_code=400, detail="Status must be 'Present' or 'Absent'")
        
        # Insert attendance
        try:
            conn.execute(
                "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)",
                (attendance.employee_id, attendance.date, attendance.status)
            )
            conn.commit()
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="Attendance already marked for this employee on this date")
    
    return {"message": "Attendance marked successfully"}

@app.delete("/api/attendance/{attendance_id}")
def delete_attendance(attendance_id: int):
    with get_db() as conn:
        cursor = conn.execute("DELETE FROM attendance WHERE id = ?", (attendance_id,))
        conn.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    return {"message": "Attendance record deleted successfully"}

# Statistics
@app.get("/api/stats/employees")
def get_employee_stats():
    with get_db() as conn:
        cursor = conn.execute("""
            SELECT 
                e.employee_id,
                e.full_name,
                e.email,
                e.department,
                COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
                COUNT(a.id) as total_days
            FROM employees e
            LEFT JOIN attendance a ON e.employee_id = a.employee_id
            GROUP BY e.employee_id
            ORDER BY e.full_name
        """)
        stats = [dict(row) for row in cursor.fetchall()]
    
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)