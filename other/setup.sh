#!/bin/bash

echo "=========================================="
echo "Certificate Verification System - Setup"
echo "=========================================="
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo ""

# Check MongoDB
echo "Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB is not found in PATH!"
    echo "Please ensure MongoDB is installed and running."
    echo "Download from: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Install backend dependencies
echo "Installing Backend Dependencies..."
cd backend
rm -f package-lock.json
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
echo "Installing Frontend Dependencies..."
cd frontend
rm -f package-lock.json
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies!"
    exit 1
fi
cd ..
echo ""

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Make sure MongoDB is running: sudo service mongod start"
echo "2. Configure .env files (already created with defaults)"
echo "3. Run ./start-dev.sh to start both servers"
echo ""
