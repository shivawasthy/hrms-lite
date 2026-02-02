import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Filter, Trash2 } from 'lucide-react';
import { attendanceAPI, employeeAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [filters, setFilters] = useState({
    employee_id: '',
    date: '',
  });

  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [attendanceData, employeeData] = await Promise.all([
        attendanceAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setAttendance(attendanceData);
      setEmployees(employeeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    try {
      const filterParams = {};
      if (newFilters.employee_id) filterParams.employee_id = newFilters.employee_id;
      if (newFilters.date) filterParams.date = newFilters.date;
      
      const data = await attendanceAPI.getAll(filterParams);
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFilters = async () => {
    setFilters({ employee_id: '', date: '' });
    try {
      const data = await attendanceAPI.getAll();
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id) {
      errors.employee_id = 'Please select an employee';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await attendanceAPI.create(formData);
      setSuccess('Attendance marked successfully!');
      setShowAddModal(false);
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      setFormErrors({});
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (attendanceId) => {
    try {
      await attendanceAPI.delete(attendanceId);
      setSuccess('Attendance record deleted successfully!');
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading attendance..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-description">Track and manage employee attendance records</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="card-title">
            <Filter size={20} />
            Filters
          </h2>
          {(filters.employee_id || filters.date) && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
        <div className="card-body">
          <div className="filters">
            <div className="filter-group">
              <label className="form-label">Employee</label>
              <select
                name="employee_id"
                className="form-select"
                value={filters.employee_id}
                onChange={handleFilterChange}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_id} - {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={20} />
            Attendance Records
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            disabled={employees.length === 0}
          >
            <Plus size={18} />
            Mark Attendance
          </button>
        </div>
        <div className="card-body">
          {employees.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No employees available"
              description="Please add employees first before marking attendance"
            />
          ) : attendance.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <span className="employee-id">{record.employee_id}</span>
                      </td>
                      <td>{record.full_name}</td>
                      <td>
                        <span className="department-badge">{record.department}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteConfirm(record)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No attendance records"
              description="Start marking attendance for your employees"
              action={
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={18} />
                  Mark First Attendance
                </button>
              }
            />
          )}
        </div>
      </div>

      {/* Add Attendance Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormErrors({});
          setError(null);
        }}
        title="Mark Attendance"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowAddModal(false);
                setFormErrors({});
                setError(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Attendance'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Employee <span className="required">*</span>
            </label>
            <select
              name="employee_id"
              className={`form-select ${formErrors.employee_id ? 'error' : ''}`}
              value={formData.employee_id}
              onChange={handleInputChange}
            >
              <option value="">Select an employee</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name} ({emp.department})
                </option>
              ))}
            </select>
            {formErrors.employee_id && (
              <p className="form-error">{formErrors.employee_id}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="date"
              className={`form-input ${formErrors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {formErrors.date && (
              <p className="form-error">{formErrors.date}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Status <span className="required">*</span>
            </label>
            <select
              name="status"
              className={`form-select ${formErrors.status ? 'error' : ''}`}
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            {formErrors.status && (
              <p className="form-error">{formErrors.status}</p>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Deletion"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(deleteConfirm?.id)}
            >
              <Trash2 size={18} />
              Delete Record
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this attendance record for{' '}
          <strong>{deleteConfirm?.full_name}</strong> on{' '}
          <strong>{deleteConfirm && new Date(deleteConfirm.date).toLocaleDateString()}</strong>?
        </p>
      </Modal>
    </div>
  );
}
