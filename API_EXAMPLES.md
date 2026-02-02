# API Testing Examples

Use these examples to test the API directly using curl or Postman.

## Base URL
```
Local: http://localhost:8000
Production: https://your-backend-url.com
```

## 1. Health Check

```bash
curl http://localhost:8000/
```

Response:
```json
{
  "message": "HRMS Lite API",
  "version": "1.0.0"
}
```

## 2. Create Employee

```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering"
  }'
```

Response (201 Created):
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@company.com",
  "department": "Engineering",
  "created_at": "2024-02-01 10:30:00"
}
```

## 3. Get All Employees

```bash
curl http://localhost:8000/api/employees
```

## 4. Get Single Employee

```bash
curl http://localhost:8000/api/employees/EMP001
```

## 5. Delete Employee

```bash
curl -X DELETE http://localhost:8000/api/employees/EMP001
```

Response: 204 No Content

## 6. Mark Attendance

```bash
curl -X POST http://localhost:8000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2024-02-01",
    "status": "Present"
  }'
```

Response (201 Created):
```json
{
  "id": 1,
  "employee_id": "EMP001",
  "date": "2024-02-01",
  "status": "Present",
  "created_at": "2024-02-01 10:35:00"
}
```

## 7. Get All Attendance

```bash
curl http://localhost:8000/api/attendance
```

## 8. Filter Attendance by Employee

```bash
curl "http://localhost:8000/api/attendance?employee_id=EMP001"
```

## 9. Filter Attendance by Date

```bash
curl "http://localhost:8000/api/attendance?date_filter=2024-02-01"
```

## 10. Get Employee Attendance History

```bash
curl http://localhost:8000/api/employees/EMP001/attendance
```

## 11. Get Employee Statistics

```bash
curl http://localhost:8000/api/stats/employees
```

Response:
```json
[
  {
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "total_present": 15,
    "total_absent": 2,
    "total_records": 17
  }
]
```

## 12. Delete Attendance Record

```bash
curl -X DELETE http://localhost:8000/api/attendance/1
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Employee ID 'EMP001' already exists"
}
```

### 404 Not Found
```json
{
  "detail": "Employee 'EMP999' not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## Interactive API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI documentation where you can test all endpoints directly in your browser.
