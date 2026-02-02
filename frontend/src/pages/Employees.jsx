import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Mail, Building2 } from 'lucide-react';
import { employeeAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employee_id.trim()) {
      errors.employee_id = 'Employee ID is required';
    }
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
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
      await employeeAPI.create(formData);
      setSuccess('Employee added successfully!');
      setShowAddModal(false);
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
      setFormErrors({});
      loadEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await employeeAPI.delete(employeeId);
      setSuccess('Employee deleted successfully!');
      setDeleteConfirm(null);
      loadEmployees();
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading employees..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-description">Manage your organization's employee records</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Users size={20} />
            Employee Directory
          </h2>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Employee
          </button>
        </div>
        <div className="card-body">
          {employees.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employee_id}>
                      <td>
                        <span className="employee-id">{employee.employee_id}</span>
                      </td>
                      <td>{employee.full_name}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Mail size={16} />
                          {employee.email}
                        </div>
                      </td>
                      <td>
                        <span className="department-badge">
                          <Building2 size={14} />
                          {employee.department}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteConfirm(employee)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No employees yet"
              description="Get started by adding your first employee to the system"
              action={
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={18} />
                  Add First Employee
                </button>
              }
            />
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormErrors({});
          setError(null);
        }}
        title="Add New Employee"
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
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Employee ID <span className="required">*</span>
            </label>
            <input
              type="text"
              name="employee_id"
              className={`form-input ${formErrors.employee_id ? 'error' : ''}`}
              value={formData.employee_id}
              onChange={handleInputChange}
              placeholder="e.g., EMP001"
            />
            {formErrors.employee_id && (
              <p className="form-error">{formErrors.employee_id}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              className={`form-input ${formErrors.full_name ? 'error' : ''}`}
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="e.g., John Doe"
            />
            {formErrors.full_name && (
              <p className="form-error">{formErrors.full_name}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g., john.doe@company.com"
            />
            {formErrors.email && (
              <p className="form-error">{formErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Department <span className="required">*</span>
            </label>
            <input
              type="text"
              name="department"
              className={`form-input ${formErrors.department ? 'error' : ''}`}
              value={formData.department}
              onChange={handleInputChange}
              placeholder="e.g., Engineering"
            />
            {formErrors.department && (
              <p className="form-error">{formErrors.department}</p>
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
              onClick={() => handleDelete(deleteConfirm?.employee_id)}
            >
              <Trash2 size={18} />
              Delete Employee
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete employee <strong>{deleteConfirm?.full_name}</strong>?
          This action cannot be undone and will also delete all associated attendance records.
        </p>
      </Modal>
    </div>
  );
}
