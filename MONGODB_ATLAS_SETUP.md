# 🍃 MongoDB Atlas Setup Guide

Your Project ID: `6a6cf66505170407b6ba1fd9`

---

## 📋 Why Database Isn't Showing

Currently, your app uses an **in-memory mock database** because:
1. ❌ MongoDB Atlas connection string is not configured
2. ❌ Your `.env` file had `localhost:27017` (local MongoDB, not cloud)
3. ✅ App works with mock DB, but data **resets** on server restart

---

## 🚀 Get Your MongoDB Atlas Connection String

### **Step 1: Login to MongoDB Atlas**
```
Go to: https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9
```

### **Step 2: Create Database User (If Not Done)**
1. Click **"Database Access"** (left sidebar)
2. Click **"+ Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `ugo_admin` (or any name)
5. Password: `<create-strong-password>` (save this!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### **Step 3: Allow Network Access**
1. Click **"Network Access"** (left sidebar)
2. Click **"+ Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (for development)
   - Or add `0.0.0.0/0` manually
4. Click **"Confirm"**
5. ⏳ Wait 1-2 minutes for changes to take effect

### **Step 4: Get Connection String**
1. Click **"Database"** (left sidebar)
2. Find your cluster (usually named `Cluster0`)
3. Click **"Connect"** button
4. Choose **"Connect your application"**
5. Driver: **Node.js**
6. Version: **4.1 or later**
7. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 5: Update Your .env File**

Open `backend/.env` and replace:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ugo-db?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your database username (e.g., `ugo_admin`)
- Replace `<password>` with your database password
- Replace `cluster0.xxxxx` with your actual cluster address
- Keep `/ugo-db` at the end (this is your database name)

**Example (with fake credentials):**
```env
MONGO_URI=mongodb+srv://ugo_admin:MyStr0ngP@ss@cluster0.abc123.mongodb.net/ugo-db?retryWrites=true&w=majority
```

---

## ✅ Verify Connection

### **1. Restart Backend Server**
```bash
# Stop the current server (Ctrl+C)
cd backend
node server.js
```

### **2. Check Logs**
You should see:
```
✅ MongoDB connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

Instead of:
```
⚠️  MongoDB connection failed: connect ECONNREFUSED
```

### **3. Check MongoDB Atlas Dashboard**
1. Go to **"Database"** → **"Browse Collections"**
2. You should see database: **`ugo-db`**
3. Collections will appear after first use:
   - `users` (riders and drivers)
   - `rides` (ride bookings)
   - `payments` (payment records)

---

## 🎯 What Changes After Connection

### **Before (Mock DB):**
```
❌ Data resets on server restart
❌ Not shared between deployments
❌ Can't see data in MongoDB Atlas
✅ Works for local testing
```

### **After (MongoDB Atlas):**
```
✅ Data persists permanently
✅ Shared across all deployments
✅ View/edit data in MongoDB Atlas UI
✅ Production-ready database
✅ Automatic backups
```

---

## 🐛 Troubleshooting

### **Error: "MongoServerError: bad auth"**
**Solution:** Wrong username or password
1. Go to **"Database Access"**
2. Edit user or create new one
3. Use correct credentials in `.env`

### **Error: "ECONNREFUSED" or "Timeout"**
**Solution:** IP not whitelisted
1. Go to **"Network Access"**
2. Add IP: `0.0.0.0/0` (allow all)
3. Wait 2 minutes for changes to apply

### **Error: "Database not found"**
**Solution:** Database will be created automatically on first data write
- Just use the app (book a ride, register user)
- Database `ugo-db` will appear automatically

### **Still Using Mock DB**
Check these:
1. ✅ `MONGO_URI` is set in `.env` (not `MONGODB_URI`)
2. ✅ Connection string has correct username/password
3. ✅ Cluster address is correct
4. ✅ Network access is configured
5. ✅ Backend server restarted after `.env` changes

---

## 📊 View Your Data

### **MongoDB Atlas UI:**
1. Go to: https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9
2. Click **"Database"** → **"Browse Collections"**
3. Select database: **`ugo-db`**
4. View collections:
   - **users**: All riders and drivers
   - **rides**: All ride bookings
   - **payments**: Payment transactions

### **MongoDB Compass (Desktop App):**
1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Paste your connection string
4. Click **"Connect"**
5. Browse database visually

---

## 🔒 Security Best Practices

### **For Development:**
```
✅ IP Whitelist: 0.0.0.0/0 (allow all) is OK
✅ Database User: Read/Write access is OK
```

### **For Production:**
```
⚠️ IP Whitelist: Add only Vercel/server IPs
⚠️ Strong Password: Use 20+ character random string
⚠️ Separate Users: Different users for dev/prod
⚠️ Enable Monitoring: Set up alerts in Atlas
```

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Get connection string from MongoDB Atlas
# 2. Update backend/.env:
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ugo-db

# 3. Restart backend
cd backend
node server.js

# 4. Check logs for:
✅ MongoDB connected: cluster0...

# 5. Use the app to create data
# 6. View in MongoDB Atlas: Database → Browse Collections
```

---

## 📞 Need Help?

### **MongoDB Atlas Support:**
- Docs: https://docs.atlas.mongodb.com/
- Support: https://support.mongodb.com/

### **Common Links:**
- Dashboard: https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9
- Database Access: https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9#/security/database/users
- Network Access: https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9#/security/network/accessList

---

**Once connected, your database will appear in MongoDB Atlas and data will persist! 🎉**
