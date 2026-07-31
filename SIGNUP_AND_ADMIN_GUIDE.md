# Signup Form & Admin Dashboard Guide

## Overview
Complete signup system with validation, authentication, and admin dashboard to view all registered users.

## Features

### 1. **Signup Form** (`/signup`)
- Fast signup with phone or email
- Form validation (name, email/phone, role selection, terms agreement)
- OTP verification flow
- Social login options (Google, Phone)
- Guest mode option
- Role selection (Rider or Driver)

**Fields:**
- Name (required, min 2 chars)
- Phone (10-digit) or Email (with @ symbol)
- Role (Rider or Driver)
- Terms agreement (required)
- OTP verification (6-digit code)

### 2. **Backend API**

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",  // OR email
  "email": "john@example.com",  // OR phone
  "role": "rider",  // or "driver"
  "quickSignup": true
}

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "rider",
  "token": "jwt_token"
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```
GET /api/users/profile
Authorization: Bearer {token}

Response: User object
```

#### Get All Users (Admin)
```
GET /api/users/all
Authorization: Bearer {token}

Response:
{
  "total": 10,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "rider",
      "vehicleType": "UgoX",
      "createdAt": "2024-08-01T12:00:00Z",
      "updatedAt": "2024-08-01T12:00:00Z"
    }
    // ... more users
  ]
}
```

### 3. **Admin Dashboard** (`/admin`)
Protected route that requires authentication. Shows:
- **Total users count** by role
- **Search functionality** by name, email, or phone
- **Filter buttons** for Riders/Drivers/All
- **User table** with details:
  - Name
  - Email
  - Phone
  - Role (Rider/Driver)
  - Vehicle Type (for drivers)
  - Join Date
  - Status
- **Export to CSV** button
- **Refresh** button to reload data
- **Logout** button

**Access:** 
- URL: `http://localhost:5173/admin`
- Requires valid JWT token in localStorage as `ugo_token`

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (unique, lowercase),
  phone: String (unique, 10-digit),
  password: String (hashed, optional for quick signup),
  role: String (enum: 'rider', 'driver'),
  
  // Driver-specific
  location: { lat: Number, lng: Number },
  isAvailable: Boolean,
  vehicleType: String,
  vehicleName: String,
  licensePlate: String,
  rating: Number,
  totalRides: Number,
  profilePhoto: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

## Workflow

### 1. User Signs Up
- User fills out form with name, phone/email, role
- Form validates input
- User agrees to terms
- Click "Continue" → OTP sent
- User enters 6-digit OTP
- Account created in database
- JWT token generated and stored in localStorage
- User redirected to dashboard/ride page

### 2. User Logs Into Admin
- Go to `/admin`
- If not authenticated, redirected to `/login`
- Admin logs in with email/password
- JWT token stored in localStorage
- Admin dashboard fetches all users via `/api/users/all`
- Can search, filter, export users

### 3. Data Persistence
- All signup data stored in MongoDB
- Encrypted passwords (bcrypt)
- Unique email/phone per user
- Timestamps for join date tracking

## Authentication

### JWT Token Flow
1. User signs up/logs in
2. Server generates JWT token with user ID
3. Token stored in browser's localStorage as `ugo_token`
4. For protected routes, token sent in `Authorization` header
5. Backend middleware (`authMiddleware.js`) verifies token
6. If valid, request proceeds; if invalid, returns 401 Unauthorized

### Protected Routes
- `/admin` - Get all users (requires auth)
- `/api/users/profile` - Get user profile (requires auth)
- `/api/users/all` - Get all users (requires auth)

## Testing

### Test Signup
1. Go to `http://localhost:5173/signup`
2. Enter name: "Test User"
3. Enter phone: "9876543210" or email: "test@example.com"
4. Select role: "Rider"
5. Check agreement
6. Click "Continue with Phone/Email"
7. Enter OTP: "123456" (any 6 digits for testing)
8. Account created!

### Test Admin Dashboard
1. Go to `http://localhost:5173/admin`
2. Use same credentials to login
3. View all registered users in table
4. Search by name, email, or phone
5. Filter by Riders/Drivers
6. Export data to CSV

## File Structure
```
frontend/src/pages/
  ├── Landing.jsx
  ├── Signup.jsx (existing)
  ├── AdminDashboard.jsx (new)
  └── AdminDashboard.css (new)

backend/
  ├── controller/
  │   └── usercontroller.js (updated with getAllUsers)
  ├── middleware/
  │   └── authMiddleware.js (existing)
  ├── Models/
  │   └── user.js (existing)
  └── routes/
      └── userRoutes.js (updated with /all endpoint)
```

## Running the System

### Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Error Handling

### Common Errors
- **"Not authorized, no token"** → Login required
- **"User already exists"** → Email/phone already registered
- **"Invalid 10-digit phone"** → Phone format error
- **"Password too short"** → Min 6 characters
- **"Name too short"** → Min 2 characters

## Security Notes
- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 30 days
- Unique email/phone constraints prevent duplicates
- Input validation on both frontend and backend
- Protected API routes require valid JWT token
- CORS enabled for localhost:5173

## Next Steps
- Add email verification (send actual OTP via email)
- Add SMS/phone verification (send OTP via Twilio)
- Add admin role management
- Add user profile edit page
- Add delete user functionality
- Add analytics dashboard
