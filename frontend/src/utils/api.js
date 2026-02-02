// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'APIError';
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorDetails = null;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      errorDetails = errorData;
    } catch (e) {
      // If parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new APIError(errorMessage, response.status, errorDetails);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// Employee API
export const employeeAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    return handleResponse(response);
  },
  
  async getById(employeeId) {
    const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}`);
    return handleResponse(response);
  },
  
  async create(employeeData) {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },
  
  async delete(employeeId) {
    const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Attendance API
export const attendanceAPI = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.employee_id) params.append('employee_id', filters.employee_id);
    if (filters.date) params.append('date_filter', filters.date);
    
    const url = `${API_BASE_URL}/api/attendance${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },
  
  async getByEmployee(employeeId) {
    const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/attendance`);
    return handleResponse(response);
  },
  
  async create(attendanceData) {
    const response = await fetch(`${API_BASE_URL}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendanceData),
    });
    return handleResponse(response);
  },
  
  async delete(attendanceId) {
    const response = await fetch(`${API_BASE_URL}/api/attendance/${attendanceId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Stats API
export const statsAPI = {
  async getEmployeeStats() {
    const response = await fetch(`${API_BASE_URL}/api/stats/employees`);
    return handleResponse(response);
  },
};

export { APIError };
