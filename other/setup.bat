@echo off
echo ==========================================
echo Certificate Verification System - Setup
echo ==========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB is not found in PATH!
    echo Please ensure MongoDB is installed and running.
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
)

echo Installing Backend Dependencies...
cd backend
if exist package-lock.json del package-lock.json
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
cd ..
echo.

echo Installing Frontend Dependencies...
cd frontend
if exist package-lock.json del package-lock.json
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
cd ..
echo.

echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Configure .env files (already created with defaults)
echo 3. Run start-dev.bat to start both servers
echo.
pause
