# ✅ MongoDB Atlas - Whitelist Your IP (5 minutes)

## Quick Steps:

### Step 1: Go to MongoDB Atlas
- Open: https://cloud.mongodb.com
- Login with your account

### Step 2: Navigate to Network Access
- In the left sidebar, click **"Network Access"**
- You'll see a list of IP addresses

### Step 3: Add Your IP
- Click the blue **"+ Add IP Address"** button
- A popup will appear

### Step 4: Allow from Anywhere (Development)
- In the popup, click **"Allow Access from Anywhere"**
- This will show: `0.0.0.0/0` (allows all IPs)
- Click **"Confirm"**

### Step 5: Wait for Changes
- The status will show "Pending"
- Wait 1-2 minutes for it to become active (shows green checkmark)

### Step 6: Restart Backend
After it's whitelisted, go back to your terminal and restart:
```powershell
# Press Ctrl+C to stop the current backend
# Then run:
npm run dev
```

You should see:
```
✅ MongoDB connected: cluster0.yzm1j0j.mongodb.net
```

---

## Why This Works?
MongoDB Atlas needs to know which IP addresses are allowed to connect. By whitelisting "Anywhere" (0.0.0.0/0), you're saying "allow connections from any IP". This is fine for development.

For production, you'd only whitelist your specific server IP.

---

## Already Did This?
If you already whitelisted your IP and the backend still won't connect:
1. Check internet connection
2. Make sure the MONGO_URI in `.env` is correct
3. Verify username and password match

---

Done! Your backend should connect to MongoDB now. 🎉
