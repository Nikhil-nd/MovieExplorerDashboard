@echo off
echo Movie Explorer Dashboard Launcher
echo ==============================
echo.

echo Checking MongoDB status...
mongod --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo MongoDB not found. Please ensure MongoDB is installed and in your PATH.
    echo Visit https://www.mongodb.com/try/download/community for installation.
    pause
    exit /b 1
)

echo Starting MongoDB (if not already running)...
powershell -Command "Start-Process mongod -ArgumentList '--dbpath=C:/data/db' -WindowStyle Minimized"
timeout /t 5 /nobreak >nul

echo.
echo Starting backend server...
cd backend
echo Installing dependencies (this may take a moment)...
call npm install
echo.
echo Seeding database with sample data...
call npm run seed
echo.
echo Starting server...
start cmd /k npm start

echo.
echo Movie Explorer Dashboard is now running!
echo.
echo To use the application:
echo 1. Open your browser and go to: http://localhost:3000
echo 2. For offline mode, open frontend/offline.html directly
echo.
echo Press any key to shutdown services when done...
pause

echo Shutting down server and MongoDB...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im mongod.exe >nul 2>&1
echo Goodbye!
pause