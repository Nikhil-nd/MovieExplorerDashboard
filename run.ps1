# Movie Explorer Dashboard Launcher
Write-Host "Movie Explorer Dashboard Launcher" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host

# Check if MongoDB is installed
Write-Host "Checking MongoDB status..." -ForegroundColor Yellow
try {
    $null = mongod --version
    Write-Host "MongoDB found!" -ForegroundColor Green
} catch {
    Write-Host "MongoDB not found. Please ensure MongoDB is installed and in your PATH." -ForegroundColor Red
    Write-Host "Visit https://www.mongodb.com/try/download/community for installation." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start MongoDB in background
Write-Host "Starting MongoDB (if not already running)..." -ForegroundColor Yellow
Start-Process mongod -ArgumentList "--dbpath=C:/data/db" -WindowStyle Minimized
Start-Sleep -Seconds 5

# Navigate to backend directory
Set-Location -Path ".\backend"

# Install dependencies
Write-Host "Installing dependencies (this may take a moment)..." -ForegroundColor Yellow
npm install

# Seed the database
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
npm run seed

# Start the server
Write-Host "Starting server..." -ForegroundColor Yellow
$serverProcess = Start-Process npm -ArgumentList "start" -PassThru -NoNewWindow

Write-Host
Write-Host "Movie Explorer Dashboard is now running!" -ForegroundColor Green
Write-Host
Write-Host "To use the application:" -ForegroundColor Cyan
Write-Host "1. Open your browser and go to: http://localhost:3000" -ForegroundColor White
Write-Host "2. For offline mode, open frontend/offline.html directly" -ForegroundColor White
Write-Host

# Wait for user to stop
Read-Host "Press Enter to shutdown services when done"

# Clean up
Write-Host "Shutting down server and MongoDB..." -ForegroundColor Yellow
if ($null -ne $serverProcess) { Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue }
Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Goodbye!" -ForegroundColor Green
Read-Host "Press Enter to exit"