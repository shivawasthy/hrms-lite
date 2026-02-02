# HRMS Lite - Human Resource Management System

A modern, lightweight HR management system for managing employees and tracking attendance. Built with React and FastAPI.

![HRMS Lite](https://img.shields.io/badge/status-production-green)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![FastAPI](https://img.shields.io/badge/fastapi-0.115.0-009688)
![Python](https://img.shields.io/badge/python-3.10+-blue)

## 🚀 Live Demo

- **Frontend URL**: [Your deployed frontend URL]
- **Backend API**: [Your deployed backend URL]
- **API Documentation**: [Your backend URL]/docs

## ✨ Features

### Core Features
- **Employee Management**
  - Add new employees with unique ID, name, email, and department
  - View complete employee directory
  - Delete employee records
  - Input validation and duplicate prevention

- **Attendance Tracking**
  - Mark daily attendance (Present/Absent)
  - View attendance history
  - Filter attendance by employee and date
  - Delete attendance records

- **Dashboard & Analytics**
  - Employee statistics overview
  - Total attendance metrics
  - Recent attendance logs
  - Per-employee attendance breakdown

### Technical Features
- ✅ RESTful API architecture
- ✅ Client-side and server-side validation
- ✅ Professional, responsive UI
- ✅ Error handling with user-friendly messages
- ✅ Loading states and empty states
- ✅ Confirmation dialogs for destructive actions
- ✅ Real-time data updates

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.0
- **Routing**: React Router DOM 6.26.0
- **Icons**: Lucide React 0.263.1
- **Styling**: Custom CSS (Modern, professional design)

### Backend
- **Framework**: FastAPI 0.115.0
- **Server**: Uvicorn 0.31.0
- **Validation**: Pydantic 2.9.0
- **Database**: SQLite (with context manager)
- **CORS**: Full CORS support for frontend integration

### Database Schema

**Employees Table**
```sql
- employee_id (TEXT, PRIMARY KEY)
- full_name (TEXT, NOT NULL)
- email (TEXT, UNIQUE, NOT NULL)
- department (TEXT, NOT NULL)
- created_at (TIMESTAMP)
```

**Attendance Table**
```sql
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- employee_id (TEXT, FOREIGN KEY)
- date (TEXT, NOT NULL)
- status (TEXT, CHECK: 'Present' or 'Absent')
- created_at (TIMESTAMP)
- UNIQUE(employee_id, date)
```

## 📋 Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher

## 🚀 Getting Started

### Option 1: Quick Start (Recommended)

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hrms-lite
```

2. **Run setup script**
```bash
# Make script executable (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or for Windows
setup.bat
```

This will automatically:
- Install backend dependencies
- Install frontend dependencies
- Start both servers

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the backend server**
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`
API documentation at: `http://localhost:8000/docs`

#### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create .env file
cp .env.example .env

# Edit .env and update VITE_API_URL if needed
# Default: VITE_API_URL=http://localhost:8000
```

4. **Run the development server**
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render/Railway/Fly.io)

1. **Create a new web service**
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

4. **Environment Variables**:
   - None required for SQLite
   - For production, consider PostgreSQL

### Frontend Deployment (Vercel/Netlify)

1. **Create a new project**
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `frontend`

4. **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend URL

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py              # FastAPI application & API routes
│   ├── requirements.txt      # Python dependencies
│   ├── .gitignore
│   └── hrms.db              # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── Modal.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   ├── utils/
│   │   │   └── api.js       # API utility functions
│   │   ├── App.jsx          # Main App component
│   │   ├── App.css          # Global styles
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## 🔌 API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/{employee_id}` - Get employee by ID
- `POST /api/employees` - Create new employee
- `DELETE /api/employees/{employee_id}` - Delete employee

### Attendance

- `GET /api/attendance` - Get all attendance records (with optional filters)
- `GET /api/employees/{employee_id}/attendance` - Get employee attendance
- `POST /api/attendance` - Mark attendance
- `DELETE /api/attendance/{attendance_id}` - Delete attendance record

### Statistics

- `GET /api/stats/employees` - Get employee statistics with attendance counts

### Example API Request

```bash
# Create an employee
curl -X POST "http://localhost:8000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering"
  }'

# Mark attendance
curl -X POST "http://localhost:8000/api/attendance" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2024-02-01",
    "status": "Present"
  }'
```

## ✅ Validation Rules

### Employee
- **Employee ID**: Required, alphanumeric with hyphens/underscores, unique
- **Full Name**: Required, non-empty
- **Email**: Required, valid email format, unique
- **Department**: Required, non-empty

### Attendance
- **Employee ID**: Required, must exist in employees table
- **Date**: Required, valid date format
- **Status**: Required, must be "Present" or "Absent"
- **Constraint**: One attendance record per employee per day

## 🎨 Design Philosophy

The UI follows a modern, professional design with:
- Clean, spacious layouts
- Consistent typography (Plus Jakarta Sans)
- Smooth animations and transitions
- Intuitive navigation
- Clear visual hierarchy
- Responsive design for all screen sizes
- Professional color palette
- Accessible contrast ratios

## 🐛 Error Handling

The application includes comprehensive error handling:
- **Backend**: Proper HTTP status codes (400, 404, 500) with descriptive messages
- **Frontend**: User-friendly error messages and recovery options
- **Validation**: Both client-side and server-side validation
- **Network**: Graceful handling of connection failures

## 🔒 Assumptions & Limitations

1. **Single Admin User**: No authentication/authorization system (as per requirements)
2. **SQLite Database**: Suitable for development; use PostgreSQL for production at scale
3. **No Edit Functionality**: Employees and attendance records can only be added or deleted
4. **Date Constraint**: Cannot mark future attendance dates
5. **Single Attendance Per Day**: One record per employee per day

## 🚀 Future Enhancements

Potential improvements for production use:
- User authentication and role-based access control
- Edit functionality for employees and attendance
- Bulk attendance marking
- Export reports (PDF/Excel)
- Email notifications
- Leave management system
- Performance reviews
- Department management
- Advanced analytics and charts
- Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created as part of a coding assignment.

## 👨‍💻 Developer

Created as a full-stack coding assignment demonstrating:
- Modern React development with hooks
- RESTful API design with FastAPI
- Database modeling and operations
- Professional UI/UX design
- Production-ready code quality
- Comprehensive documentation

---

**Need help?** Check the `/docs` endpoint on the backend for interactive API documentation.
