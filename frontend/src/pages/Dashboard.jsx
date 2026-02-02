import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { statsAPI, attendanceAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, attendanceData] = await Promise.all([
        statsAPI.getEmployeeStats(),
        attendanceAPI.getAll()
      ]);
      
      setStats(statsData);
      setRecentAttendance(attendanceData.slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const totalEmployees = stats?.length || 0;
  const totalPresent = stats?.reduce((sum, emp) => sum + emp.total_present, 0) || 0;
  const totalAbsent = stats?.reduce((sum, emp) => sum + emp.total_absent, 0) || 0;
  const totalRecords = totalPresent + totalAbsent;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of your HR management system</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Users size={24} />
          </div>
          <div className="stat-value">{totalEmployees}</div>
          <div className="stat-label">Total Employees</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <CheckCircle size={24} />
          </div>
          <div className="stat-value">{totalPresent}</div>
          <div className="stat-label">Total Present</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <XCircle size={24} />
          </div>
          <div className="stat-value">{totalAbsent}</div>
          <div className="stat-label">Total Absent</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <Calendar size={24} />
          </div>
          <div className="stat-value">{totalRecords}</div>
          <div className="stat-label">Attendance Records</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Users size={20} />
            Employee Statistics
          </h2>
        </div>
        <div className="card-body">
          {stats && stats.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((emp) => (
                    <tr key={emp.employee_id}>
                      <td>
                        <span className="employee-id">{emp.employee_id}</span>
                      </td>
                      <td>{emp.full_name}</td>
                      <td>
                        <span className="department-badge">{emp.department}</span>
                      </td>
                      <td>{emp.total_present}</td>
                      <td>{emp.total_absent}</td>
                      <td><strong>{emp.total_records}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No employee data available</p>
          )}
        </div>
      </div>

      {recentAttendance.length > 0 && (
        <div className="card mt-3">
          <div className="card-header">
            <h2 className="card-title">
              <Calendar size={20} />
              Recent Attendance
            </h2>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.full_name}</td>
                      <td>
                        <span className="department-badge">{record.department}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
