#!/bin/bash

echo "=========================================="
echo "Starting Certificate Verification System"
echo "=========================================="
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    sudo service mongod start
    sleep 3
fi
echo ""

# Start backend
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..
sleep 5
echo ""

# Start frontend
echo "Starting Frontend Server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..
echo ""

echo "=========================================="
echo "All Services Started!"
echo "=========================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
