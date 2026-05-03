# Smart Public Complaint & AI-Based Issue Tracking System

## Tech Stack
- **Frontend**: React, React Router, Recharts, @react-google-maps/api
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **AI**: NLP keyword engine (built-in), duplicate detection
- **Auth**: JWT + bcrypt
- **Notifications**: Nodemailer (Gmail)

## Project Structure
```
fsd project/
├── backend/
│   ├── controllers/     # authController, complaintController, analyticsController
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # User, Complaint schemas
│   ├── routes/          # auth, complaints, analytics
│   ├── utils/           # aiEngine, mailer, upload
│   ├── .env
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── api/         # axios instance
        ├── components/  # Navbar, PrivateRoute, StatusBadge, PriorityBadge
        ├── context/     # AuthContext
        ├── pages/       # Home, Login, Register, ComplaintsList, NewComplaint, ComplaintDetail, AdminDashboard
        └── App.js
```

## Setup

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI, JWT secret, email credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Edit .env with your Google Maps API key
npm start
```

## Environment Variables

### backend/.env
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `EMAIL_USER` | Gmail address for notifications |
| `EMAIL_PASS` | Gmail app password |
| `CLIENT_URL` | Frontend URL (http://localhost:3000) |

### frontend/.env
| Variable | Description |
|---|---|
| `REACT_APP_GOOGLE_MAPS_KEY` | Google Maps JavaScript API key |

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/profile` | Auth | Get profile |
| POST | `/api/complaints` | Citizen | Submit complaint (multipart) |
| GET | `/api/complaints` | Auth | List complaints (with filters) |
| GET | `/api/complaints/:id` | Auth | Get complaint detail |
| PATCH | `/api/complaints/:id/status` | Admin | Update status |
| DELETE | `/api/complaints/:id` | Admin | Delete complaint |
| GET | `/api/analytics` | Admin | Get analytics data |

## AI Features
- **Auto-categorization**: NLP keyword matching detects category (pothole, garbage, water_leakage, streetlight)
- **Priority assignment**: Severity keywords assign low/medium/high/critical priority
- **Duplicate detection**: Similarity + proximity check flags duplicate complaints within 7 days
