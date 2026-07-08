# NCERT Gamified Learning Platform

A cost-effective, gamified learning application designed to make NCERT-based Mathematics and Science engaging for school students through interactive activities and challenges.

## Features
- **Student Dashboard**: Track XP, Levels, Coins, and Daily Streaks.
- **Teacher Dashboard**: Monitor class metrics and individual student progress.
- **Gamification Engine**: Custom rule-based logic for dynamic learning incentives without external AI APIs.
- **30 Interactive Activities**: Covering 10 critical NCERT topics across Mathematics and Science using Quiz, Match, Sort, and Drag-Drop mechanics.

## Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS (Glassmorphism UI)
- **Backend**: Node.js (Express)
- **Database**: SQLite (Local, Lightweight, zero operational cost)

## How to Run Locally

### 1. Start the Backend Server
The backend runs on port `3000` and automatically seeds the SQLite database with 30 activities.
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`

### 2. Start the Frontend Server
The frontend is a Vite-powered React SPA.
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 3. Usage
- Open the local URL provided by Vite (e.g., `http://localhost:5173`) in your browser.
- Create an account by selecting the **Student** role to start playing activities.
- Create another account by selecting the **Teacher** role to view aggregated class progress.

## Project Structure
- `/backend/db.js`: Initializes the SQLite database and schemas.
- `/backend/server.js`: Handles REST APIs and gamification tracking.
- `/frontend/src/components/activities`: Contains the robust game templates (Quiz, Match, Sorter, DragDrop).
- `/frontend/src/pages/`: Contains the main Dashboard logic for different user roles.
