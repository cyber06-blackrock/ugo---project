# MongoDB Local Setup (Windows)

## Option 1: Download MongoDB Community Server (Easiest)

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **OS**: Windows (x64)
   - Click **Download**
3. Run the installer (MSI file)
4. Click **Next** → **Install MongoDB as a Service** → Finish
5. MongoDB will automatically start as a service

## Option 2: Quick Setup (Already Installed?)

If you already have MongoDB, update your `.env`:

```
MONGO_URI=mongodb://localhost:27017/ugo-db
```

## Verify MongoDB is Running

Open PowerShell and run:
```powershell
mongosh
```

If you see a connection prompt, MongoDB is running! Type `exit` to quit.

## Start Backend

```powershell
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected: 127.0.0.1
🚀 Server running on port 5000
```

---

## Alternative: Use MongoDB Atlas with VPN

If local MongoDB doesn't work and Atlas connection fails:
1. Install a VPN (NordVPN, ExpressVPN, etc.)
2. Connect to VPN
3. Restart backend: `npm run dev`

The VPN will give you a different IP that MongoDB Atlas can recognize.
