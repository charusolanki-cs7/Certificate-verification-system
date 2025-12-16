# Backend - Certificate Verification System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate-verification
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

**Windows:**
```bash
mongod
```

**Linux/Mac:**
```bash
sudo service mongod start
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Health Check
- **GET** `/api/health`
  - Check if server is running
  - Response: `{ status: 'success', message: 'Server is running', timestamp: '...' }`

### Authentication Routes (`/api/auth`)

#### Register Admin
- **POST** `/api/auth/admin/register`
- Body: `{ name, email, password }`
- Returns: JWT token and admin data

#### Login Admin
- **POST** `/api/auth/admin/login`
- Body: `{ email, password }`
- Returns: JWT token and admin data

#### Get Current Admin
- **GET** `/api/auth/admin/me`
- Headers: `Authorization: Bearer {token}`
- Returns: Current admin data

#### Update Password
- **PUT** `/api/auth/admin/updatepassword`
- Headers: `Authorization: Bearer {token}`
- Body: `{ currentPassword, newPassword }`
- Returns: New JWT token

### Admin Routes (`/api/admin`) - Protected

#### Upload Students
- **POST** `/api/admin/upload-students`
- Headers: `Authorization: Bearer {token}`
- Body: FormData with `file` field (Excel file)
- Returns: Upload results with success and failure counts

#### Get All Students
- **GET** `/api/admin/students`
- Headers: `Authorization: Bearer {token}`
- Query params: `page`, `limit`, `search`
- Returns: Paginated student list

#### Generate Certificate
- **POST** `/api/admin/generate-certificate/:studentId`
- Headers: `Authorization: Bearer {token}`
- Returns: Generated certificate data

#### Get Statistics
- **GET** `/api/admin/stats`
- Headers: `Authorization: Bearer {token}`
- Returns: Dashboard statistics

### Certificate Routes (`/api/certificate`)

#### Search Certificate
- **GET** `/api/certificate/search/:certificateId`
- Public route (rate limited: 10 requests/minute)
- Returns: Certificate details

#### Download Certificate
- **GET** `/api/certificate/download/:certificateId`
- Public route
- Returns: PDF file

#### Verify Certificate
- **POST** `/api/certificate/verify`
- Body: `{ certificateId, studentId }`
- Public route (rate limited: 10 requests/minute)
- Returns: Certificate verification result

#### Get All Certificates (Admin)
- **GET** `/api/certificate/all`
- Headers: `Authorization: Bearer {token}`
- Query params: `page`, `limit`, `search`
- Returns: Paginated certificate list

## Database Models

### Admin
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'admin'),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Student
```javascript
{
  studentId: String (unique),
  name: String,
  email: String,
  phone: String,
  internshipDomain: String,
  startDate: Date,
  endDate: Date,
  certificateIssued: Boolean,
  certificateId: String (unique),
  uploadedBy: ObjectId (Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Certificate
```javascript
{
  certificateId: String (unique),
  student: ObjectId (Student),
  studentName: String,
  studentId: String,
  internshipDomain: String,
  startDate: Date,
  endDate: Date,
  issueDate: Date,
  pdfPath: String,
  isValid: Boolean,
  verificationCount: Number,
  lastVerified: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Directory Structure

```
backend/
├── controllers/           # Request handlers
│   ├── auth.controller.js
│   ├── admin.controller.js
│   └── certificate.controller.js
├── middleware/           # Custom middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── rateLimiter.middleware.js
├── models/              # Database models
│   ├── Admin.model.js
│   ├── Student.model.js
│   └── Certificate.model.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── admin.routes.js
│   ├── student.routes.js
│   └── certificate.routes.js
├── utils/               # Utility functions
│   └── token.util.js
├── uploads/             # Uploaded Excel files (temp)
├── certificates/        # Generated PDF certificates
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── server.js           # Entry point
```

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Rate Limiting**:
   - Auth routes: 5 attempts per 15 minutes
   - Search routes: 10 requests per minute
   - General: 100 requests per 15 minutes
4. **Input Validation**: express-validator
5. **Security Headers**: Helmet
6. **CORS**: Configured allowed origins
7. **File Upload Security**: Type and size validation

## Error Handling

All errors are handled centrally and return JSON responses:

```javascript
{
  status: 'error',
  statusCode: 400,
  message: 'Error message',
  errors: [] // validation errors if any
}
```

## Testing

Use tools like Postman or Thunder Client to test the API endpoints.

### Example: Register Admin
```bash
POST http://localhost:5000/api/auth/admin/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Example: Upload Students
```bash
POST http://localhost:5000/api/admin/upload-students
Authorization: Bearer {your_token}
Content-Type: multipart/form-data

file: students.xlsx
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB is accessible

### Port Already in Use
- Change PORT in .env file
- Kill the process using the port

### File Upload Issues
- Ensure uploads/ directory exists
- Check file size (max 5MB)
- Verify file format (.xlsx or .xls)

## Production Considerations

1. Use environment-specific .env files
2. Set strong JWT_SECRET
3. Use MongoDB Atlas for production database
4. Enable HTTPS
5. Set up PM2 for process management
6. Use Nginx as reverse proxy
7. Enable logging and monitoring
8. Set up automated backups
