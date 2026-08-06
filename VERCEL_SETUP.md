# Vercel Deployment Setup Guide

## ✅ Fixed Issues

### 1. **API Connection Fixed**
- ✅ Added `frontend/.env.production` with backend URL
- ✅ Updated CORS in `backend/server.js` to allow your frontend URL
- ✅ Pushed changes to GitHub (auto-deploying to Vercel)

---

## 🔧 Vercel Environment Variables Setup

### **Backend Environment Variables**

Go to your **Backend** Vercel project settings and add these environment variables:

```
MONGO_URI=mongodb://anveshadwivedi10_db_user:qs4e63a51cOXBLjH@ac-hhnpwur-shard-00-00.yzm1j0j.mongodb.net:27017,ac-hhnpwur-shard-00-01.yzm1j0j.mongodb.net:27017,ac-hhnpwur-shard-00-02.yzm1j0j.mongodb.net:27017/ugo-db?ssl=true&replicaSet=atlas-sjb7e4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

NODE_ENV=production
```

### **How to Add Environment Variables in Vercel:**

1. Go to https://vercel.com/dashboard
2. Select your **backend** project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Variable Name: `MONGO_URI`
   - Value: (paste the MongoDB connection string above)
   - Environment: Check **Production**, **Preview**, and **Development**
5. Click **Save**
6. Repeat for `JWT_SECRET` and `NODE_ENV`
7. **Redeploy** the backend after adding variables

---

## 🚀 Deployment URLs

### **Live URLs:**
- **Frontend:** https://frontend-iota-two-94.vercel.app
- **Backend:** https://backend-liard-three-37.vercel.app

### **Test Your Deployment:**

1. **Health Check:**
   ```
   https://backend-liard-three-37.vercel.app/api/health
   ```
   Should return: `{ "status": "ok", "message": "Backend server is running" }`

2. **Active Rides:**
   ```
   https://backend-liard-three-37.vercel.app/api/rides/active
   ```
   Should return: Array of active rides

3. **Frontend:**
   - Visit: https://frontend-iota-two-94.vercel.app
   - Sign up / Login
   - Book a ride
   - Check MongoDB Atlas → ugo-db → rides collection

---

## 🔍 Troubleshooting

### **Issue: "API not fetching data"**

**Solution:**
1. ✅ Check if MONGO_URI is set in Vercel backend environment variables
2. ✅ Check CORS is allowing your frontend URL (already fixed)
3. ✅ Check frontend is using correct backend URL (already fixed with `.env.production`)
4. ✅ Redeploy both frontend and backend after changes

### **Issue: "CORS error in browser console"**

**Solution:**
- Already fixed! Backend now allows: `https://frontend-iota-two-94.vercel.app`
- If you change frontend URL, update `backend/server.js` CORS config

### **Issue: "MongoDB connection failed on Vercel"**

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Confirm**
5. Redeploy Vercel backend

---

## 📊 MongoDB Atlas Dashboard

**View Your Data:**
- Dashboard: https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9
- Database: `ugo-db`
- Collections: `users`, `rides`, `payments`, `drivers`

---

## ✅ What's Working Now

1. ✅ **Local Development:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - MongoDB Atlas connected

2. ✅ **Mock Database Removed:**
   - 100% real MongoDB data
   - All data persists

3. ✅ **Vercel CORS Fixed:**
   - Backend allows frontend URL
   - Frontend uses production backend URL

4. ✅ **Auto-Deploy:**
   - Push to GitHub → Auto-deploys to Vercel

---

## 🎯 Next Steps

1. **Add MongoDB URI to Vercel backend** (if not already done)
2. **Wait 2-3 minutes** for deployment to complete
3. **Test the live app** at: https://frontend-iota-two-94.vercel.app
4. **Sign up** and **book a ride**
5. **Check MongoDB Atlas** to see the data!

---

## 🆘 Still Having Issues?

Tell me:
1. What error you see in browser console (F12 → Console tab)
2. Are you testing on localhost or Vercel?
3. What specific action is not working (signup, login, book ride, etc.)

I'll help debug! 🚀
