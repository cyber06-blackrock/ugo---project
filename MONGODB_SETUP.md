# MongoDB Atlas Setup Guide

## Quick Steps to Connect MongoDB

### 1. Create Free MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click **"Sign Up"** (or sign in if you have an account)
- Create a free account with email/Google/GitHub

### 2. Create a Free Cluster
- After login, click **"Create a Deployment"**
- Select **"M0 Free"** (permanently free with 512 MB storage)
- Choose your region (closest to you, e.g., us-east-1 for US)
- Click **"Create Deployment"**
- Wait 3-5 minutes for cluster creation

### 3. Create Database User
- In the left sidebar, go to **"Database Access"**
- Click **"Add New Database User"**
- Choose **"Password"** authentication
- Set username: `ugo_user`
- Set password: `ugo_password_123` (or your choice, remember it!)
- Click **"Add User"**

### 4. Whitelist Your IP
- In the left sidebar, go to **"Network Access"**
- Click **"Add IP Address"**
- Select **"Allow Access from Anywhere"** (for development)
- Click **"Confirm"**

### 5. Get Connection String
- Click on your cluster name, then click **"Connect"**
- Choose **"Drivers"** (not MongoDB Shell)
- Select **"Node.js"**
- Copy the connection string
- It looks like: `mongodb+srv://ugo_user:ugo_password_123@cluster0.xxxxx.mongodb.net/ugo-db?retryWrites=true&w=majority`

### 6. Update Backend `.env`
Open `backend/.env` and replace:
```
MONGO_URI=mongodb+srv://ugo_user:ugo_password_123@cluster0.xxxxx.mongodb.net/ugo-db?retryWrites=true&w=majority
```

Replace:
- `ugo_user` with your username
- `ugo_password_123` with your password
- `cluster0.xxxxx` with your actual cluster subdomain

### 7. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

---

## Done! 🎉
Your backend is now connected to MongoDB Atlas in the cloud!

### Next Steps:
1. Frontend signup will create users in MongoDB
2. Users will be saved with name + phone or name + email
3. Authentication tokens will be issued on signup/login
