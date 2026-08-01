# Test Driver Signup & Go Online Feature

## Quick Test Steps

### 1. Create a Driver Account
1. Open browser: `http://localhost:5173/signup`
2. Fill in the form:
   - **Name**: Test Driver
   - **Email**: driver@test.com
   - **Password**: test123
   - **Confirm Password**: test123
   - **Role**: Click on **"🚙 Driver"** (not Rider)
3. Click **"Sign Up"**

### 2. Check Dashboard
After signup, you should be redirected to: `http://localhost:5173/dashboard`

**You should see:**
- ✅ "Go Online to Earn" header at the top
- ✅ Green **"Go Online"** button
- ✅ "You'll start receiving nearby ride requests instantly." text
- ✅ Today's earnings: ₹0
- ✅ Map with your location
- ✅ "No rides yet" message

### 3. Test Go Online Button
1. Click the **"Go Online"** button
2. Status should change to **"You are Online"**
3. Button text changes to **"Go Offline"**
4. Success notification: "✅ You are now online. Finding rides…"
5. Timer starts counting hours

### 4. Test Go Offline
1. Click **"Go Offline"** button
2. Status changes back to "Go Online to Earn"
3. Button text changes to "Go Online"

## Troubleshooting

### If you don't see the signup page:
- Check frontend is running: `http://localhost:5173/`
- Check browser console for errors (F12)

### If you can't create account:
- Check backend is running on port 5000
- Look at backend terminal for error messages

### If you're redirected to /ride instead of /dashboard:
- You selected "Rider" instead of "Driver"
- Clear localStorage: Open Console (F12) and run: `localStorage.clear()`
- Try signup again, select **"🚙 Driver"** this time

### If button doesn't respond:
- Open browser console (F12)
- Check for error messages
- Verify API connection: `http://localhost:5000/api/health`

## Backend Logs
When you click "Go Online", backend should log:
```
📊 Driver Test Driver is now ONLINE
```

When you click "Go Offline", backend should log:
```
📊 Driver Test Driver is now OFFLINE
```

## Current Status Check
- ✅ Backend running: http://localhost:5000
- ✅ Frontend running: http://localhost:5173
- ✅ Mock database active
- ✅ Driver status endpoint working

## Alternative: Manual Database Check
To verify driver was created, go to Admin Dashboard:
1. Go to: `http://localhost:5173/admin`
2. Login with the driver credentials (driver@test.com / test123)
3. You should see the driver account in the users table
4. Role column should show "🧑‍💼 driver"
