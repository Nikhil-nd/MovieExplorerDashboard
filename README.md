# Movie Explorer Dashboard

A full-stack web application that allows users to browse, search, filter movies, and save them to a Watch Later list.

## Prerequisites

- Node.js v14+ installed
- MongoDB v4+ running locally

## Getting Started

### 1. Start MongoDB

Make sure MongoDB is running on the default port (27017).

In a terminal:
```
mongod --dbpath=<your_db_path>
```

### 2. Install dependencies

From the backend directory:
```
npm install
```

### 3. Run the Application

#### Using the startup script (recommended)

This script will check MongoDB connection, seed data if needed, and start the server:

```
npm run startapp
```

#### Manual steps

If you prefer to run each step manually:

1. Seed the database (first time or to reset):
```
npm run seed
```

2. Start the server:
```
npm start
```

## Accessing the App

Once the server is running, open your browser and navigate to:

```
http://localhost:3000
```

## Features

- Browse movies with poster images
- Filter by genre
- Search by movie title, genre, director
- Save movies to Watch Later list (persists in browser)
- Responsive design for mobile and desktop

## Project Structure

- `/backend` - Express server, MongoDB models, API endpoints
- `/frontend` - HTML, CSS, JavaScript client application

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Backend: Node.js, Express, MongoDB, Mongoose

## Offline Mode

For a quick demo without setting up MongoDB, open:

```
frontend/offline.html
```

This standalone HTML file includes a limited set of sample movies and all functionality except adding new movies.