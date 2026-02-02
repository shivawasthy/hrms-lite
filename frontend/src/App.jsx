import React, { useState, useEffect } from 'react';
import { Users, Calendar, BarChart3 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [page, setPage] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    fetchStats();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch(`${API_URL}/api/employees`);
    const data = await res.json();
    setEmployees(data);
  };

  const fetchAttendance = async () => {
    const res = await fetch(`${API_URL}/api/attendance`);
    const data = await res.json();
    setAttendance(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/api/stats/employees`);
    const data = await res.json();
    setStats(data);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      });
      if (res.ok) {
        alert('Employee added successfully!');
        setEmployeeForm({ employee_id: '', full_name: '', email: '', department: '' });
        fetchEmployees();
        fetchStats();
      } else {
        const error = await res.json();
        alert(error.detail || 'Failed to add employee');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceForm)
      });
      if (res.ok) {
        alert('Attendance marked successfully!');
        fetchAttendance();
        fetchStats();
      } else {
        const error = await res.json();
        alert(error.detail || 'Failed to mark attendance');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!confirm('Delete this employee?')) return;
    await fetch(`${API_URL}/api/employees/${employeeId}`, { method: 'DELETE' });
    fetchEmployees();
    fetchAttendance();
    fetchStats();
  };

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <h1 style={styles.title}>HRMS Lite</h1>
        <div style={styles.navButtons}>
          <button onClick={() => setPage('dashboard')} style={page === 'dashboard' ? styles.navBtnActive : styles.navBtn}>
            <BarChart3 size={18} /> Dashboard
          </button>
          <button onClick={() => setPage('employees')} style={page === 'employees' ? styles.navBtnActive : styles.navBtn}>
            <Users size={18} /> Employees
          </button>
          <button onClick={() => setPage('attendance')} style={page === 'attendance' ? styles.navBtnActive : styles.navBtn}>
            <Calendar size={18} /> Attendance
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        {page === 'dashboard' && (
          <div>
            <h2>Dashboard</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3>{employees.length}</h3>
                <p>Total Employees</p>
              </div>
              <div style={styles.statCard}>
                <h3>{attendance.length}</h3>
                <p>Total Attendance Records</p>
              </div>
            </div>
            <h3 style={{marginTop: '30px'}}>Employee Statistics</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Present Days</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(emp => (
                  <tr key={emp.employee_id}>
                    <td style={styles.td}>{emp.employee_id}</td>
                    <td style={styles.td}>{emp.full_name}</td>
                    <td style={styles.td}>{emp.department}</td>
                    <td style={styles.td}>{emp.present_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page === 'employees' && (
          <div>
            <h2>Employee Management</h2>
            <form onSubmit={handleAddEmployee} style={styles.form}>
              <h3>Add New Employee</h3>
              <input
                placeholder="Employee ID (e.g., EMP001)"
                value={employeeForm.employee_id}
                onChange={(e) => setEmployeeForm({...employeeForm, employee_id: e.target.value})}
                style={styles.input}
                required
              />
              <input
                placeholder="Full Name"
                value={employeeForm.full_name}
                onChange={(e) => setEmployeeForm({...employeeForm, full_name: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                style={styles.input}
                required
              />
              <input
                placeholder="Department"
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({...employeeForm, department: e.target.value})}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? 'Adding...' : 'Add Employee'}
              </button>
            </form>

            <h3 style={{marginTop: '30px'}}>All Employees</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.employee_id}>
                    <td style={styles.td}>{emp.employee_id}</td>
                    <td style={styles.td}>{emp.full_name}</td>
                    <td style={styles.td}>{emp.email}</td>
                    <td style={styles.td}>{emp.department}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteEmployee(emp.employee_id)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page === 'attendance' && (
          <div>
            <h2>Attendance Management</h2>
            <form onSubmit={handleMarkAttendance} style={styles.form}>
              <h3>Mark Attendance</h3>
              <select
                value={attendanceForm.employee_id}
                onChange={(e) => setAttendanceForm({...attendanceForm, employee_id: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_id} - {emp.full_name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={attendanceForm.date}
                onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                style={styles.input}
                required
              />
              <select
                value={attendanceForm.status}
                onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})}
                style={styles.input}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? 'Marking...' : 'Mark Attendance'}
              </button>
            </form>

            <h3 style={{marginTop: '30px'}}>Attendance Records</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td style={styles.td}>{record.employee_id}</td>
                    <td style={styles.td}>{record.full_name}</td>
                    <td style={styles.td}>{record.date}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, backgroundColor: record.status === 'Present' ? '#D1FAE5' : '#FEE2E2', color: record.status === 'Present' ? '#065F46' : '#991B1B'}}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#f9fafb' },
  nav: { backgroundColor: '#4F46E5', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  navButtons: { display: 'flex', gap: '12px' },
  navBtn: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  navBtnActive: { backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid white', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' },
  statCard: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' },
  btn: { backgroundColor: '#4F46E5', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  deleteBtn: { backgroundColor: '#EF4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  table: { width: '100%', backgroundColor: 'white', borderRadius: '12px', marginTop: '20px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '12px', textAlign: 'left', backgroundColor: '#f9fafb', fontWeight: '600', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' },
  td: { padding: '12px', borderBottom: '1px solid #f3f4f6', fontSize: '14px' },
  badge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', display: 'inline-block' }
};

export default App;
