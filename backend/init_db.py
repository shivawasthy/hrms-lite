import sqlite3

def init_database():
    conn = sqlite3.connect('hrms.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS employees (
        employee_id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('''
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
    
    sample_employees = [
        ('EMP001', 'John Doe', 'john.doe@company.com', 'Engineering'),
        ('EMP002', 'Jane Smith', 'jane.smith@company.com', 'Marketing'),
        ('EMP003', 'Bob Johnson', 'bob.johnson@company.com', 'Sales'),
    ]
    
    cursor.executemany('''
    INSERT OR IGNORE INTO employees (employee_id, full_name, email, department)
    VALUES (?, ?, ?, ?)
    ''', sample_employees)
    
    sample_attendance = [
        ('EMP001', '2024-02-01', 'Present'),
        ('EMP001', '2024-02-02', 'Present'),
        ('EMP002', '2024-02-01', 'Present'),
        ('EMP002', '2024-02-02', 'Absent'),
    ]
    
    cursor.executemany('''
    INSERT OR IGNORE INTO attendance (employee_id, date, status)
    VALUES (?, ?, ?)
    ''', sample_attendance)
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully with sample data!")

if __name__ == "__main__":
    init_database()