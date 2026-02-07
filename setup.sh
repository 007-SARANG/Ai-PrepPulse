#!/bin/bash

echo "================================================"
echo "   AI PrepPulse - Automated Setup Script"
echo "================================================"
echo ""

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"
echo ""

echo "[2/5] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

echo "[3/5] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "[4/5] Setting up environment variables..."
if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env"
    echo "⚠ Created backend/.env file"
    echo "⚠ IMPORTANT: Add your GEMINI_API_KEY to backend/.env"
else
    echo "✓ backend/.env already exists"
fi
echo ""

echo "[5/5] Setup complete!"
echo ""
echo "================================================"
echo "   Next Steps:"
echo "================================================"
echo "1. Add your Gemini API Key to backend/.env"
echo "   Get it from: https://makersuite.google.com/app/apikey"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "3. Start the frontend (in new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "================================================"
echo ""
