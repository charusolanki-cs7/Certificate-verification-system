# 🧪 API Testing Guide

Complete guide for testing all API endpoints using tools like Postman, Thunder Client, or cURL.

## 🔧 Setup

### Base URL
```
http://localhost:5000/api
```

### Headers for Protected Routes
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

## 📋 Test Sequence

Follow this order for systematic testing:

1. Health Check
2. Admin Registration
3. Admin Login
4. Upload Students
5. Get Students List
6. Generate Certificate
7. Search Certificate
8. Download Certificate

---

## 1️⃣ Health Check

### Endpoint
```
GET /api/health
```

### cURL
```bash
curl http://localhost:5000/api/health
```

### Expected Response
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

---

## 2️⃣ Admin Registration

### Endpoint
```
POST /api/auth/admin/register
```

### Request Body
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### cURL
```bash
curl -X POST http://localhost:5000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

### Expected Response
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "admin": {
      "_id": "6579abc123def456",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2025-12-16T10:30:00.000Z"
    }
  }
}
```

**Save the token for subsequent requests!**

---

## 3️⃣ Admin Login

### Endpoint
```
POST /api/auth/admin/login
```

### Request Body
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### cURL
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

### Expected Response
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "admin": {
      "_id": "6579abc123def456",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "lastLogin": "2025-12-16T10:35:00.000Z"
    }
  }
}
```

---

## 4️⃣ Get Current Admin

### Endpoint
```
GET /api/auth/admin/me
```

### Headers
```
Authorization: Bearer YOUR_TOKEN
```

### cURL
```bash
curl -X GET http://localhost:5000/api/auth/admin/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": "success",
  "data": {
    "admin": {
      "_id": "6579abc123def456",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  }
}
```

---

## 5️⃣ Upload Students (Excel)

### Endpoint
```
POST /api/admin/upload-students
```

### Headers
```
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data
```

### Request Body (Form Data)
```
file: [Excel file]
```

### cURL
```bash
curl -X POST http://localhost:5000/api/admin/upload-students \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@students.xlsx"
```

### Expected Response
```json
{
  "status": "success",
  "message": "Uploaded 5 students successfully",
  "data": {
    "successful": 5,
    "failed": 0,
    "successfulUploads": [
      {
        "_id": "6579xyz789abc123",
        "studentId": "STU001",
        "name": "John Doe",
        "email": "john@example.com",
        "internshipDomain": "Web Development",
        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": "2025-03-01T00:00:00.000Z",
        "certificateIssued": false
      }
    ],
    "failedUploads": []
  }
}
```

---

## 6️⃣ Get All Students

### Endpoint
```
GET /api/admin/students
```

### Query Parameters (Optional)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term

### cURL
```bash
# Get first page
curl -X GET "http://localhost:5000/api/admin/students?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search students
curl -X GET "http://localhost:5000/api/admin/students?search=John" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": "success",
  "data": {
    "students": [
      {
        "_id": "6579xyz789abc123",
        "studentId": "STU001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "internshipDomain": "Web Development",
        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": "2025-03-01T00:00:00.000Z",
        "certificateIssued": false,
        "uploadedBy": {
          "name": "Admin User",
          "email": "admin@example.com"
        }
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 5
  }
}
```

---

## 7️⃣ Generate Certificate

### Endpoint
```
POST /api/admin/generate-certificate/:studentId
```

### cURL
```bash
curl -X POST http://localhost:5000/api/admin/generate-certificate/STU001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": "success",
  "message": "Certificate generated successfully",
  "data": {
    "certificate": {
      "_id": "6579cert456def789",
      "certificateId": "CERT-2025-123456",
      "studentName": "John Doe",
      "studentId": "STU001",
      "internshipDomain": "Web Development",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-03-01T00:00:00.000Z",
      "issueDate": "2025-12-16T10:40:00.000Z",
      "isValid": true,
      "pdfPath": "/certificates/CERT-2025-123456.pdf"
    }
  }
}
```

**Save the certificateId for testing search and download!**

---

## 8️⃣ Get Dashboard Statistics

### Endpoint
```
GET /api/admin/stats
```

### cURL
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": "success",
  "data": {
    "totalStudents": 5,
    "certificatesIssued": 1,
    "pendingCertificates": 4,
    "recentStudents": [
      {
        "name": "John Doe",
        "studentId": "STU001",
        "email": "john@example.com",
        "internshipDomain": "Web Development",
        "createdAt": "2025-12-16T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 9️⃣ Search Certificate (Public)

### Endpoint
```
GET /api/certificate/search/:certificateId
```

### cURL
```bash
curl -X GET http://localhost:5000/api/certificate/search/CERT-2025-123456
```

### Expected Response
```json
{
  "status": "success",
  "data": {
    "certificate": {
      "certificateId": "CERT-2025-123456",
      "studentName": "John Doe",
      "studentId": "STU001",
      "internshipDomain": "Web Development",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-03-01T00:00:00.000Z",
      "issueDate": "2025-12-16T10:40:00.000Z",
      "isValid": true
    }
  }
}
```

---

## 🔟 Verify Certificate (Public)

### Endpoint
```
POST /api/certificate/verify
```

### Request Body
```json
{
  "certificateId": "CERT-2025-123456",
  "studentId": "STU001"
}
```

### cURL
```bash
curl -X POST http://localhost:5000/api/certificate/verify \
  -H "Content-Type: application/json" \
  -d "{\"certificateId\":\"CERT-2025-123456\",\"studentId\":\"STU001\"}"
```

### Expected Response
```json
{
  "status": "success",
  "message": "Certificate verified successfully",
  "data": {
    "certificate": {
      "certificateId": "CERT-2025-123456",
      "studentName": "John Doe",
      "studentId": "STU001",
      "internshipDomain": "Web Development",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-03-01T00:00:00.000Z",
      "issueDate": "2025-12-16T10:40:00.000Z",
      "isValid": true
    }
  }
}
```

---

## 1️⃣1️⃣ Download Certificate (Public)

### Endpoint
```
GET /api/certificate/download/:certificateId
```

### cURL
```bash
curl -X GET http://localhost:5000/api/certificate/download/CERT-2025-123456 \
  --output certificate.pdf
```

### Expected Response
- Returns PDF file
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="CERT-2025-123456.pdf"

---

## ❌ Error Response Examples

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Not authorized. Please login to access this resource."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Certificate not found. Please check the certificate ID and try again."
}
```

### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## 🧪 Postman Collection

### Import into Postman:

1. Create a new collection: "Certificate Verification API"
2. Add environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)

3. Add these requests:

**1. Health Check**
- GET: `{{base_url}}/health`

**2. Admin Register**
- POST: `{{base_url}}/auth/admin/register`
- Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```
- Tests (to save token):
```javascript
pm.environment.set("token", pm.response.json().token);
```

**3. Admin Login**
- POST: `{{base_url}}/auth/admin/login`
- Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- Tests:
```javascript
pm.environment.set("token", pm.response.json().token);
```

**4. Protected Routes**
- Add to Headers: `Authorization: Bearer {{token}}`

---

## 🎯 Testing Checklist

### Authentication Tests:
- [ ] Register new admin
- [ ] Register with duplicate email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with invalid token (should fail)

### Student Management Tests:
- [ ] Upload valid Excel file
- [ ] Upload file with missing fields (should show errors)
- [ ] Upload file with duplicate studentId (should show errors)
- [ ] Upload file with invalid dates (should show errors)
- [ ] Get students list
- [ ] Search students by name
- [ ] Paginate through students

### Certificate Tests:
- [ ] Generate certificate for valid student
- [ ] Generate certificate twice (should fail second time)
- [ ] Search certificate with valid ID
- [ ] Search certificate with invalid ID (should fail)
- [ ] Download certificate PDF
- [ ] Verify certificate with matching IDs
- [ ] Verify certificate with mismatched IDs (should fail)

### Rate Limiting Tests:
- [ ] Make 6 login attempts quickly (6th should be rate limited)
- [ ] Make 11 certificate searches quickly (11th should be rate limited)

---

## 📊 Performance Testing

### Load Testing with cURL:
```bash
# Test 100 concurrent search requests
for i in {1..100}; do
  curl -X GET http://localhost:5000/api/certificate/search/CERT-2025-123456 &
done
wait
```

### Expected Behavior:
- Server should handle all requests
- Rate limiter should kick in after threshold
- No crashes or errors

---

## 🔍 Debugging Tips

### View Request/Response in Detail:
```bash
curl -v http://localhost:5000/api/health
```

### Test with Different HTTP Methods:
```bash
# Should return 404 or method not allowed
curl -X DELETE http://localhost:5000/api/auth/admin/login
```

### Test CORS:
```bash
curl -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS http://localhost:5000/api/health
```

---

## ✅ Success Criteria

All tests pass when:
1. All endpoints return expected responses
2. Protected routes reject unauthorized access
3. Validation catches invalid inputs
4. Rate limiting works correctly
5. File upload handles various scenarios
6. Certificate generation and download work
7. Search and verification are accurate

---

**Happy Testing! 🧪**
