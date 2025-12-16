@echo off
echo ==========================================
echo Starting Certificate Verification System
echo ==========================================
echo.

echo Starting MongoDB...
start "MongoDB" mongod
timeout /t 3 /nobreak >nul
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak >nul
echo.

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"
echo.

echo ==========================================
echo All Services Started!
echo ==========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
echo Note: Keep the MongoDB, Backend, and Frontend windows open!
pause >nul
