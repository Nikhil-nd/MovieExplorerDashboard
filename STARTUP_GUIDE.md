# Movie Explorer Dashboard - Startup Guide

This guide will help you get the Movie Explorer Dashboard application up and running.

## Prerequisites

- Node.js installed (v14+ recommended)
- MongoDB installed (v4.0+ recommended)
- NPM (comes with Node.js)

## Quick Start

The easiest way to start the application is to use our prepared scripts:

### PowerShell (Recommended)

```powershell
cd backend
.\Start.ps1
```

### Command Prompt

```cmd
cd backend
start.bat
```

## Manual Setup Steps

If you prefer to start everything manually or if you encounter issues:

### 1. MongoDB Setup

Make sure MongoDB is installed and running:

```
mongod
```

If you have MongoDB installed in a custom location, use:

```
mongod --dbpath=C:\path\to\data\folder
```

### 2. Seed the Database

From the backend directory:

```
npm run seed
```

### 3. Start the Server

From the backend directory:

```
npm start
```

## Accessing the Application

Once the server is running, open your browser and visit:

```
http://localhost:3000
```

## Troubleshooting

If you encounter issues, use our diagnostic tool:

```
npm run diagnose
```

### Common Problems and Solutions

1. **MongoDB not running**:
   - Error message: "Failed to connect to MongoDB"
   - Solution: Start MongoDB with `mongod`

2. **Port 3000 already in use**:
   - Error message: "Port 3000 is already in use"
   - Solution: Find and close the application using port 3000, or
   - Change the port in server.js (e.g., to 3001)

3. **Database empty**:
   - Symptom: No movies showing up in the UI
   - Solution: Run `npm run seed` to populate the database

4. **API errors in console**:
   - Solution: Check browser console (F12) and server logs

## Need More Help?

Run the diagnostic tool that will check for common issues:

```
npm run diagnose
```

This will check for:
- MongoDB installation and connection
- Port availability
- Node modules installation
- Database status