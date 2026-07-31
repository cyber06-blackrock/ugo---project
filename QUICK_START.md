# 🚀 Uber Clone - Quick Start Guide

## Current Status

✅ **Frontend**: Running on http://localhost:5173/
✅ **Backend**: Running on http://localhost:5000/
✅ **Database**: Using mock in-memory database (for development)

---

## 📦 MongoDB Atlas Setup (Production Ready)

Your backend is currently running with an **in-memory mock database**. This is perfect for development, but for production you need real MongoDB.

### Step 1: Create Free MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** (free, no credit card needed)
3. Complete the signup process

### Step 2: Create Free Cluster
1. After login, click **"Create a Deployment"**
2. Select **"M0 Free Tier"** (512 MB storage, perfect for testing)
3. Choose your region (closest to you)
4. Click **"Create Deployment"** and wait 2-3 minutes

### Step 3: Create Database User
1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `ugo_user`
5. Password: Create a strong password (e.g., `SecurePass123!@#`)
6. Click **"Add User"**

### Step 4: Whitelist Your IP
1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Click on your cluster
2. Click **"Connect"**
3. Choose **"Drivers"**
4. Select **"Node.js"**
5. Copy the connection string
   - It should look like: `mongodb+srv://ugo_user:PASSWORD@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`

### Step 6: Update Backend `.env`
Edit `backend/.env` and paste:
```
MONGO_URI=mongodb+srv://ugo_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ugo-db?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD` with the password you created
- `cluster0.xxxxx` with your actual cluster subdomain

### Step 7: Restart Backend
The backend will automatically reconnect to the new MongoDB:
```powershell
# Press Ctrl+C in the backend terminal, then:
npm run dev
```

---

## 🧪 Test the Connection

Once your MongoDB is connected, test user signup:

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "rider"
  }'
```

Expected response:
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "rider",
  "token": "eyJ..."
}
```

---

## 🎯 What's Working Now

### Frontend (http://localhost:5173/)
- ✅ Landing page with ride options (UgoX, UgoAuto, UgoMoto, etc.)
- ✅ Real auto-rickshaw image for UgoAuto
- ✅ Popular routes in Jaipur
- ✅ Fast signup with phone/email/Google options
- ✅ OTP verification flow
- ✅ Guest mode option

### Backend (http://localhost:5000/)
- ✅ User registration (email or phone)
- ✅ User login
- ✅ JWT authentication
- ✅ Profile retrieval
- ✅ Real-time Socket.IO for driver locations

### Database
- ✅ Mock in-memory storage (development)
- 🔄 Ready for MongoDB Atlas (follow steps above)

---

## 📱 Test the App

1. Open http://localhost:5173/ in your browser
2. Click **"Sign up"**
3. Fill in your details:
   - Name: Your Name
   - Choose Phone or Email signup
   - Role: Select Rider or Driver
   - Accept Terms
4. Click **"Continue with Phone/Email"**
5. Enter the OTP (any 6 digits in development mode)
6. ✅ Account created!

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Check your MONGO_URI in `backend/.env` is correct
- Verify username/password match
- Ensure IP is whitelisted in MongoDB Atlas
- For now, it's fine - using mock database

### Frontend can't reach backend
- Make sure backend is running: `npm run dev` in `backend/` folder
- Check VITE_API_URL in `frontend/.env` is `http://localhost:5000`

### Port already in use
- Frontend (5173): `npx vite --port 5174`
- Backend (5000): `PORT=5001 npm run dev`

---

## 📚 Next Steps

1. **Setup MongoDB Atlas** (follow steps above)
2. **Test user registration** with real database
3. **Build driver dashboard** for accepting rides
4. **Build rider booking** flow
5. **Implement real-time** location tracking
6. **Add payments** integration

---

**Questions?** Check backend logs: `npm run dev` shows all connection details.

Happy coding! 🚀
