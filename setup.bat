@echo off
echo ================================================
echo   AI PrepPulse - Automated Setup Script
echo ================================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

echo [3/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo [4/5] Setting up environment variables...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ⚠ Created backend\.env file
    echo ⚠ IMPORTANT: Add your GEMINI_API_KEY to backend\.env
) else (
    echo ✓ backend\.env already exists
)
echo.

echo [5/5] Setup complete!
echo.
echo ================================================
echo   Next Steps:
echo ================================================
echo 1. Add your Gemini API Key to backend\.env
echo    Get it from: https://makersuite.google.com/app/apikey
echo.
echo 2. Start the backend server:
echo    cd backend
echo    npm start
echo.
echo 3. Start the frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo ================================================
echo.
pause
