# Consultant Booking App

## Features
- Create consultation slots using date & time picker
- Book and cancel slots
- Search slots by time
- Filter by available / booked
- Pagination (5 slots per page)

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: SQLite

## How to Run

### Backend
cd backend
npm install
npm start

### Frontend
cd frontend/react-ui
npm start

## API Endpoints
- POST /api/slots
- GET /api/slots?page=&search=&status=
- POST /api/book
- POST /api/cancel

## AI Collaboration Log
AI Tool Used: ChatGPT

### How AI Helped
- Designed REST API structure
- Implemented pagination using LIMIT/OFFSET
- Added search and filter logic
- Helped integrate date picker into React UI

### Example Prompt
"Build a booking system with Node, SQLite, pagination, search, filter, and React UI"

### Example Correction
AI initially suggested using a UI date picker library.
I instead used native HTML date/time inputs to reduce dependencies and complexity.
