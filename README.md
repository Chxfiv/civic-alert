# Smart Public Complaint & AI-Based Issue Tracking System

## Tech Stack

* **Frontend**: React, React Router, Recharts, @react-google-maps/api
* **Backend**: Node.js, Express, MongoDB (Mongoose)
* **AI**: NLP keyword engine (built-in), duplicate detection
* **Auth**: JWT + bcrypt
* **Notifications**: Nodemailer (Gmail)

## Project Structure

```
fsd project/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
└── frontend/
    ├── public/
    └── src/
```

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint                   | Access  |
| ------ | -------------------------- | ------- |
| POST   | /api/auth/register         | Public  |
| POST   | /api/auth/login            | Public  |
| GET    | /api/complaints            | Auth    |
| POST   | /api/complaints            | Citizen |
| PATCH  | /api/complaints/:id/status | Admin   |

## AI Features

* Auto Categorization
* Priority Assignment
* Duplicate Detection
