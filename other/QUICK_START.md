# 🚀 Quick Start Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MongoDB (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- ✅ npm or yarn (comes with Node.js)

## 🎯 Automated Setup (Recommended)

### Windows Users:
1. Double-click `setup.bat` to install all dependencies
2. Double-click `start-dev.bat` to start the application
3. Access the application at http://localhost:3000

### Linux/Mac Users:
```bash
# Make scripts executable
chmod +x setup.sh start-dev.sh

# Run setup
./setup.sh

# Start application
./start-dev.sh
```

## 📝 Manual Setup (Alternative)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Start MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo service mongod start
```

### Step 4: Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Step 5: Start Frontend Server (New Terminal)
```bash
cd frontend
npm start
```
Frontend will automatically open at http://localhost:3000

## 🎓 First Time Usage

### 1. Create Admin Account
- Navigate to http://localhost:3000/admin/register
- Fill in the registration form:
  - Name: Your Name
  - Email: admin@example.com
  - Password: password123 (or your choice)
- Click "Register"
- You'll be automatically logged in and redirected to the dashboard

### 2. Upload Student Data

#### Prepare Excel File:
Create an Excel file with these columns:
- studentId (e.g., STU001)
- name (e.g., John Doe)
- email (e.g., john@example.com)
- phone (e.g., 1234567890)
- internshipDomain (e.g., Web Development)
- startDate (e.g., 2025-01-01)
- endDate (e.g., 2025-03-01)

**Sample Data:**
| studentId | name | email | phone | internshipDomain | startDate | endDate |
|-----------|------|-------|-------|------------------|-----------|---------|
| STU001 | John Doe | john@email.com | 1234567890 | Web Development | 2025-01-01 | 2025-03-01 |

#### Upload Process:
1. In the dashboard, click "Upload Students" tab
2. Click the file upload area
3. Select your Excel file
4. Click "Upload Students"
5. Review the upload results

### 3. Generate Certificates
1. Go to "Manage Students" tab
2. Find a student with "Pending" status
3. Click "Generate Certificate" button
4. Certificate will be generated with a unique ID

### 4. Search and Download Certificate
1. Navigate to "Search Certificate" (or http://localhost:3000/search)
2. Enter the Certificate ID (e.g., CERT-2025-123456)
3. Click "Search Certificate"
4. View certificate details
5. Click "Download Certificate PDF" to download

## 🔑 Default Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate-verification
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📱 Application Routes

### Public Routes:
- `/` - Home page
- `/search` - Certificate search
- `/certificate/:id` - Certificate details
- `/admin/login` - Admin login
- `/admin/register` - Admin registration

### Protected Routes (Admin Only):
- `/admin/dashboard` - Admin dashboard

## ✅ Testing the Application

### Test Admin Account:
After registration, use your credentials to login.

### Test Student Upload:
1. Create a test Excel file with sample data
2. Upload through dashboard
3. Verify students appear in "Manage Students" tab

### Test Certificate Generation:
1. Select a student
2. Generate certificate
3. Note the Certificate ID

### Test Certificate Search:
1. Go to search page
2. Enter the Certificate ID
3. View and download certificate

## 🐛 Troubleshooting

### Problem: Backend won't start
**Solution:**
- Check if MongoDB is running: `mongod --version`
- Check if port 5000 is available
- Review backend console for errors

### Problem: Frontend won't start
**Solution:**
- Check if port 3000 is available
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Problem: Cannot upload Excel file
**Solution:**
- Verify file format (.xlsx or .xls only)
- Check file size (max 5MB)
- Ensure all required columns are present
- Check column names match exactly

### Problem: MongoDB connection error
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Verify MongoDB is accessible on port 27017

### Problem: Certificate not generating
**Solution:**
- Check backend console for errors
- Ensure student data is valid
- Verify uploads and certificates directories exist

### Problem: Cannot download certificate
**Solution:**
- Ensure certificate was generated
- Check if PDF file exists in backend/certificates/
- Verify Certificate ID is correct

## 📚 Additional Resources

- **Full Documentation**: See README.md
- **Excel Template Guide**: See EXCEL_TEMPLATE_GUIDE.md
- **Backend API Docs**: See backend/README.md
- **Frontend Docs**: See frontend/README.md

## 🔒 Security Notes

### For Development:
- Default JWT secret is for development only
- Change JWT_SECRET in production
- Use strong passwords for admin accounts

### For Production:
- Use environment-specific .env files
- Enable HTTPS
- Use MongoDB Atlas or secure MongoDB instance
- Set strong JWT_SECRET
- Enable rate limiting
- Regular security audits

## 🎯 Common Use Cases

### Use Case 1: Bulk Student Upload
```
1. Prepare Excel with 50 students
2. Login to admin dashboard
3. Upload Excel file
4. Review results
5. Fix any errors and re-upload
```

### Use Case 2: Generate Certificates for All Students
```
1. Go to "Manage Students" tab
2. For each student with "Pending" status:
   - Click "Generate Certificate"
3. Note down all Certificate IDs
4. Share Certificate IDs with students
```

### Use Case 3: Student Certificate Verification
```
1. Student receives Certificate ID
2. Student goes to search page
3. Enters Certificate ID
4. Views certificate details
5. Downloads PDF certificate
```

## 📊 Performance Tips

### For Large Uploads:
- Split Excel files into batches of 100 students
- Upload during off-peak hours
- Monitor backend console for errors

### For Fast Certificate Generation:
- Generate certificates in batches
- Schedule during off-peak hours
- Monitor server resources

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review error messages in console
3. Check MongoDB logs
4. Review backend server logs
5. Contact system administrator

## 🎉 Success!

If you've completed all steps, you should have:
- ✅ Running backend server
- ✅ Running frontend application
- ✅ Admin account created
- ✅ Sample students uploaded
- ✅ Certificates generated
- ✅ Certificates searchable and downloadable

Congratulations! Your Certificate Verification System is ready to use! 🎊

## 📞 Support

For additional support or questions:
- Review the comprehensive README.md
- Check individual component READMEs
- Contact your system administrator

---

**Happy Certificate Management! 🎓**
