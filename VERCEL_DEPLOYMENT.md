# 🚀 Vercel Deployment Guide - Ugo Ride App

Complete step-by-step guide to deploy your Uber-like Jaipur ride application to Vercel.

---

## 📋 Prerequisites

- ✅ GitHub account with repository access
- ✅ Vercel account (free tier works)
- ✅ All code pushed to GitHub (commit: `094958e`)

---

## 🎯 Deployment Overview

We'll deploy **TWO separate projects** on Vercel:
1. **Frontend** (React + Vite) → `frontend/`
2. **Backend** (Node.js + Express) → `backend/`

---

## 🔵 PART 1: Deploy Backend First

### **Step 1.1: Login to Vercel**
1. Go to https://vercel.com
2. Click **"Sign Up"** (if new) or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access repositories

### **Step 1.2: Create Backend Project**
1. Click **"Add New..."** → **"Project"**
2. Find repository: **"cyber06-blackrock/ugo---project"**
3. Click **"Import"**

### **Step 1.3: Configure Backend**
```
Framework Preset: Other
Root Directory: backend
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
Node.js Version: 18.x (or latest)
```

### **Step 1.4: Environment Variables**
Click **"Environment Variables"** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `production` | Environment |
| `JWT_SECRET` | `your-random-secret-key-here` | Use strong random string |
| `MONGODB_URI` | *(optional)* | Works without MongoDB (uses mock DB) |

**Generate JWT Secret:**
```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 1.5: Deploy Backend**
1. Click **"Deploy"**
2. Wait **2-3 minutes** for build
3. ✅ Success! You'll see: **"Congratulations!"**
4. **📋 Copy your backend URL:**
   - Example: `https://ugo-backend-abc123.vercel.app`
   - Or click **"Visit"** and copy URL from browser

---

## 🟢 PART 2: Deploy Frontend

### **Step 2.1: Create Frontend Project**
1. Go back to Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **same repository**: **"ugo---project"**
4. Click **"Import"** again

### **Step 2.2: Configure Frontend**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

### **Step 2.3: Environment Variables**
Click **"Environment Variables"** and add:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app` | Use URL from Step 1.5 |

**⚠️ Important:** Replace `your-backend-url` with your actual backend URL!

### **Step 2.4: Deploy Frontend**
1. Click **"Deploy"**
2. Wait **2-3 minutes**
3. ✅ Success!
4. **📋 Copy your frontend URL:**
   - Example: `https://ugo-frontend-xyz789.vercel.app`

---

## 🔄 PART 3: Update Backend CORS (Important!)

The backend needs to know which frontend domains to allow.

### **Step 3.1: Update Backend Environment**
1. Go to Vercel dashboard
2. Select your **backend project**
3. Click **"Settings"** → **"Environment Variables"**
4. Add new variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-frontend-url.vercel.app` |

### **Step 3.2: Update CORS in Code**
*(Already done in latest commit!)*

The backend `server.js` now automatically accepts:
- Your production frontend URL
- All Vercel preview deployments
- localhost for development

### **Step 3.3: Redeploy Backend**
1. Go to backend project → **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## ✅ PART 4: Verify Deployment

### **Test Your Live App:**

#### **4.1 Test Frontend:**
Visit: `https://your-frontend-url.vercel.app`

You should see:
- ✅ Landing page with Jaipur images
- ✅ Navigation menu working
- ✅ "Book a Ride" button

#### **4.2 Test Backend API:**
Visit: `https://your-backend-url.vercel.app/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

#### **4.3 Test Full Flow:**
1. **Book a ride:**
   - Go to: `https://your-frontend-url.vercel.app/ride`
   - Enter: Malviya Nagar → Hawa Mahal
   - Click "See prices"
   - Select ride type → Confirm

2. **Check driver dashboard:**
   - Go to: `https://your-frontend-url.vercel.app/driver-login`
   - Login: `amit@test.com` / `driver123`
   - Click "Go Online"
   - Should see ride requests

3. **Test cancel ride:**
   - After booking, click "Cancel Ride"
   - Verify modal shows fee
   - Confirm cancellation

---

## 🎨 Custom Domain (Optional)

### **Add Your Own Domain:**

1. **Buy domain** (e.g., ugojaipur.com from Namecheap, GoDaddy)

2. **Add to Vercel:**
   - Frontend project → **"Settings"** → **"Domains"**
   - Click **"Add"**
   - Enter: `ugojaipur.com`
   - Follow DNS setup instructions

3. **Update backend CORS:**
   - Add your custom domain to allowed origins
   - Redeploy backend

---

## 🐛 Troubleshooting

### **Problem: Frontend can't connect to backend**
**Solution:**
1. Check `VITE_API_URL` is set correctly
2. Ensure backend URL has `https://` prefix
3. Verify backend CORS allows frontend domain
4. Check browser console for errors (F12)

### **Problem: "Cannot connect to database"**
**Solution:**
- This is **normal**! App uses mock database in production
- Rides are stored in memory (resets on redeploy)
- To use real MongoDB: Add `MONGODB_URI` environment variable

### **Problem: Socket.IO not working**
**Solution:**
1. Verify backend is running: visit `/api/health`
2. Check CORS configuration includes Socket.IO
3. Ensure frontend connects to correct backend URL
4. WebSocket might not work on free Vercel (use polling fallback)

### **Problem: Images not showing**
**Solution:**
- Images in `frontend/public/images/` are included
- Check image paths are correct
- Verify build includes public folder

---

## 📊 Environment Variables Summary

### **Backend (.env.production):**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-generated-secret-key
MONGODB_URI=mongodb+srv://... (optional)
FRONTEND_URL=https://your-frontend.vercel.app
```

### **Frontend (.env.production):**
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🔒 Security Checklist

- ✅ Never commit `.env` files to GitHub
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ CORS configured for production domains only
- ✅ MongoDB connection string in environment variables
- ✅ API rate limiting enabled (in production)

---

## 📱 Features Live on Vercel

After deployment, your app will have:

✅ **Ride Booking System**
- Real-time fare quotes
- Multiple ride types (UgoX, UgoAuto, UgoMoto, etc.)
- Smart pricing based on distance

✅ **Cancel Ride Feature**
- Time-based cancellation fees
- Mobile-responsive modal
- Driver notifications

✅ **Driver Dashboard**
- Real-time ride requests
- Accept/reject rides
- Live location tracking
- Earnings stats

✅ **Additional Features**
- Car rental form
- Help page with AI chatbot
- Dual mode (Rider/Driver)
- Mobile responsive design
- Real Jaipur images

---

## 🚀 Deployment Checklist

Use this to track your progress:

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable (`VITE_API_URL`) set
- [ ] Frontend redeployed after env update
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed
- [ ] Tested landing page loads
- [ ] Tested API health endpoint
- [ ] Tested ride booking flow
- [ ] Tested driver dashboard
- [ ] Tested cancel ride feature
- [ ] Tested on mobile view
- [ ] Custom domain added (optional)

---

## 🎉 You're Live!

Your Ugo ride-hailing app is now live on Vercel!

**Share your URLs:**
- 🌐 Frontend: `https://your-frontend.vercel.app`
- 🔗 Backend API: `https://your-backend.vercel.app`

**Next Steps:**
1. Test all features thoroughly
2. Share with friends/testers
3. Monitor Vercel analytics
4. Add custom domain
5. Set up MongoDB for persistence
6. Enable error tracking (Sentry)

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console (F12)
3. Verify environment variables
4. Test backend API directly
5. Check CORS configuration

**Happy Deploying! 🚀**
