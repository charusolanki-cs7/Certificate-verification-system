# Certificate Verification System

A comprehensive MERN stack application for managing and verifying internship certificates.

## 🌟 Features

### 1. User Roles and Authentication
- **Admin Account Management**: Create and manage admin accounts
- **Secure Login**: Encrypted passwords using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Persistent sessions with token refresh

### 2. Data Management
- **Bulk Upload**: Upload student data via Excel files (.xlsx, .xls)
- **Data Validation**: Comprehensive validation of all input data
- **MongoDB Storage**: Secure storage with proper indexing
- **Error Handling**: Detailed error reporting for failed uploads

### 3. Certificate Generation
- **Automatic Generation**: Create certificates with student information
- **PDF Creation**: Generate printable PDF certificates
- **Unique IDs**: Auto-generated unique certificate IDs (CERT-YEAR-XXXXXX)
- **Custom Templates**: Professional certificate design

### 4. Certificate Search and Retrieval
- **Public Search**: Students can search using Certificate ID
- **Verification**: Verify certificate authenticity
- **Detailed Information**: View all certificate details
- **Validation Status**: Check if certificate is valid or revoked

### 5. Certificate Download
- **PDF Download**: Download certificates in PDF format
- **High Quality**: Printable and shareable format
- **Secure Access**: Rate-limited downloads

### 6. Security and Data Integrity
- **Encrypted Passwords**: bcrypt hashing
- **JWT Tokens**: Secure authentication tokens
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **Input Validation**: Server-side and client-side validation
- **XSS Prevention**: Sanitized inputs
- **CORS Protection**: Configured CORS policies
- **Helmet Security**: HTTP security headers

## 📁 Project Structure

```
Certificate-verification system/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   └── certificate.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── rateLimiter.middleware.js
│   ├── models/
│   │   ├── Admin.model.js
│   │   ├── Student.model.js
│   │   └── Certificate.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── student.routes.js
│   │   └── certificate.routes.js
│   ├── utils/
│   │   └── token.util.js
│   ├── uploads/
│   ├── certificates/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── AdminLogin.js
│   │   │   ├── AdminRegister.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── StudentSearch.js
│   │   │   └── CertificateView.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate-verification
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB server:
```bash
# Windows
mongod

# Linux/Mac
sudo service mongod start
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 Excel File Format

When uploading student data, use an Excel file with the following columns:

| studentId | name | email | phone | internshipDomain | startDate | endDate |
|-----------|------|-------|-------|------------------|-----------|---------|
| STU001 | John Doe | john@example.com | 1234567890 | Web Development | 2025-01-01 | 2025-03-01 |
| STU002 | Jane Smith | jane@example.com | 0987654321 | Data Science | 2025-01-15 | 2025-04-15 |

**Required Fields:**
- `studentId`: Unique identifier (alphanumeric)
- `name`: Student's full name
- `email`: Valid email address
- `internshipDomain`: Field of internship
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Optional Fields:**
- `phone`: 10-digit phone number

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/admin/register` - Register new admin
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/admin/me` - Get current admin (Protected)
- `PUT /api/auth/admin/updatepassword` - Update password (Protected)

### Admin Operations
- `POST /api/admin/upload-students` - Upload student data via Excel (Protected)
- `GET /api/admin/students` - Get all students with pagination (Protected)
- `POST /api/admin/generate-certificate/:studentId` - Generate certificate (Protected)
- `GET /api/admin/stats` - Get dashboard statistics (Protected)

### Certificate Operations
- `GET /api/certificate/search/:certificateId` - Search certificate (Public, Rate Limited)
- `GET /api/certificate/download/:certificateId` - Download certificate PDF (Public)
- `POST /api/certificate/verify` - Verify certificate (Public, Rate Limited)
- `GET /api/certificate/all` - Get all certificates (Protected)

## 🛡️ Security Features

### Implemented Security Measures:
1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Rate Limiting**: 
   - 5 login attempts per 15 minutes
   - 10 certificate searches per minute
   - 100 general requests per 15 minutes
4. **Input Validation**: 
   - Server-side validation with express-validator
   - Client-side validation with Formik & Yup
5. **CORS Protection**: Configured allowed origins
6. **Helmet**: Security headers
7. **File Upload Validation**: 
   - File type checking (.xlsx, .xls only)
   - File size limit (5MB)
8. **MongoDB Injection Prevention**: Mongoose sanitization
9. **XSS Prevention**: Input sanitization
10. **Error Handling**: Proper error messages without exposing sensitive info

## 🧪 Testing the Application

### 1. Register Admin Account
- Navigate to `/admin/register`
- Fill in the form with valid credentials
- Submit to create an admin account

### 2. Login
- Navigate to `/admin/login`
- Use your registered credentials
- You'll be redirected to the dashboard

### 3. Upload Student Data
- In the dashboard, go to "Upload Students" tab
- Prepare an Excel file with the required format
- Upload the file
- Review the upload results

### 4. Generate Certificates
- Go to "Manage Students" tab
- Find a student without a certificate
- Click "Generate Certificate"
- Certificate will be created with a unique ID

### 5. Search Certificate
- Navigate to `/search` or use the navbar
- Enter the certificate ID (e.g., CERT-2025-123456)
- View certificate details
- Download the PDF

## 📱 User Flow

### Admin Flow:
1. Register/Login → Dashboard
2. Upload student data via Excel
3. View uploaded students
4. Generate certificates for students
5. Monitor statistics

### Student Flow:
1. Navigate to search page
2. Enter certificate ID
3. View certificate details
4. Download certificate PDF

## ⚠️ Edge Cases Handled

1. **File Upload**:
   - Invalid file type rejection
   - File size limit enforcement
   - Empty file detection
   - Malformed Excel handling

2. **Data Validation**:
   - Duplicate student IDs
   - Invalid email formats
   - Invalid date formats
   - End date before start date
   - Missing required fields

3. **Authentication**:
   - Expired tokens
   - Invalid tokens
   - Deactivated accounts
   - Unauthorized access attempts

4. **Certificate Operations**:
   - Non-existent certificate searches
   - Duplicate certificate generation attempts
   - Missing PDF files
   - Revoked certificates

5. **Network Issues**:
   - Connection timeouts
   - Server errors
   - Database connection failures

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate-verification
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Development Notes

### Backend Dependencies:
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File upload handling
- **xlsx**: Excel file processing
- **pdfkit**: PDF generation
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **helmet**: Security headers
- **morgan**: HTTP request logger

### Frontend Dependencies:
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **formik**: Form handling
- **yup**: Schema validation
- **react-toastify**: Notifications

## 🚀 Production Deployment

### Backend:
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas)
3. Set strong JWT secret
4. Enable HTTPS
5. Configure proper CORS origins
6. Set up process manager (PM2)
7. Use reverse proxy (Nginx)

### Frontend:
1. Build production bundle: `npm run build`
2. Deploy to hosting service (Vercel, Netlify, etc.)
3. Update API URL in environment variables
4. Enable HTTPS

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions, please contact your system administrator or create an issue in the repository.

## 🎯 Future Enhancements

- Email notifications for certificate issuance
- Bulk certificate generation
- QR code on certificates for quick verification
- Advanced analytics dashboard
- Certificate templates customization
- Multi-language support
- Mobile app
- Blockchain-based verification
