# 🔧 Fix MongoDB Atlas DNS Issue

## Problem
Your computer cannot resolve MongoDB Atlas servers because your ISP (Reliance) DNS is blocking or not resolving them.

Error: `querySrv ECONNREFUSED _mongodb._tcp.cluster0.yzm1j0j.mongodb.net`

---

## ✅ Solution 1: Change DNS to Google DNS (Easiest)

### For Windows:

**Step 1: Open Network Settings**
```
1. Press Windows + R
2. Type: ncpa.cpl
3. Press Enter
```

**Step 2: Configure DNS**
```
1. Right-click your active network (WiFi or Ethernet)
2. Click "Properties"
3. Double-click "Internet Protocol Version 4 (TCP/IPv4)"
4. Select "Use the following DNS server addresses"
5. Preferred DNS: 8.8.8.8
6. Alternate DNS: 8.8.4.4
7. Click "OK" on all windows
```

**Step 3: Flush DNS Cache**
```
Open Command Prompt (Admin) and run:
ipconfig /flushdns
```

**Step 4: Test**
```
Open PowerShell and run:
nslookup cluster0.yzm1j0j.mongodb.net 8.8.8.8
```

Should see addresses instead of error!

---

## ✅ Solution 2: Use Mobile Hotspot (Quick Test)

**To verify it's a network issue:**
```
1. Enable mobile hotspot on your phone
2. Connect your computer to it
3. Restart the backend server
4. Should connect to MongoDB Atlas ✅
```

If this works, it confirms your home network/ISP is blocking MongoDB.

---

## ✅ Solution 3: Use Standard Connection String (Not SRV)

**Instead of `mongodb+srv://` use `mongodb://`**

**Get standard connection string:**
```
1. Go to MongoDB Atlas
2. Click "Connect" → "Connect your application"
3. Select: "Connection string (standard)"
4. Copy the mongodb:// URL (not mongodb+srv://)
```

Update backend/.env with the standard format.

---

## ✅ Solution 4: Disable Firewall Temporarily

**Windows Firewall:**
```
1. Search "Windows Security"
2. Click "Firewall & network protection"
3. Click your active network
4. Turn off "Windows Defender Firewall"
5. Test MongoDB connection
6. Turn firewall back on if it doesn't help
```

---

## ✅ Solution 5: Check ISP/Router Firewall

**If using Reliance JioFi or router:**
```
1. Login to router admin (usually 192.168.1.1)
2. Check firewall settings
3. Look for DNS filtering or content blocking
4. Disable any "Safe Browsing" or "Parental Controls"
5. Restart router
```

---

## 🧪 Test Connection After Each Fix

**Run this command:**
```bash
cd backend
node test-connection.js
```

**You should see:**
```
✅ SUCCESS! MongoDB Atlas connected!
📊 Connection details:
   Host: cluster0-shard-00-00.yzm1j0j.mongodb.net
   Database: ugo-db
   State: Connected
```

---

## 🎯 Quick Summary

**Most likely cause:** Your ISP (Reliance) DNS is not resolving MongoDB Atlas servers.

**Fastest fix:** Change DNS to Google DNS (8.8.8.8)

**Quick test:** Connect via mobile hotspot

**If nothing works:** Use standard `mongodb://` connection string instead of `mongodb+srv://`

---

## 📞 Alternative: Use MongoDB Atlas Data API

If you absolutely cannot connect via connection string, MongoDB Atlas offers a REST API:

https://www.mongodb.com/docs/atlas/app-services/data-api/

This works over HTTPS and doesn't require DNS resolution of MongoDB servers.

---

**After fixing, restart your backend server and it should connect!** 🎉
