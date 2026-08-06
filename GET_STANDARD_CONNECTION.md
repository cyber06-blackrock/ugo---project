# 🔗 Get Standard MongoDB Connection String

## Your Current String (Not Working)
```
mongodb+srv://anveshadwivedi10_db_user:NudKAGrglqetmGxW@cluster0.yzm1j0j.mongodb.net/ugo-db
```

**Problem:** `mongodb+srv://` requires DNS SRV record lookup, which your network is blocking.

---

## ✅ Solution: Get Standard Connection String

### **Step 1: Go to MongoDB Atlas**
```
https://cloud.mongodb.com/v2/6a6cf66505170407b6ba1fd9
```

### **Step 2: Get Standard Connection String**
```
1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Click "Connect your application"
4. Under "Connection string format":
   - Change from "DNS Seedlist Connection Format" 
   - To "Standard Connection String Format"
5. Copy the connection string
```

**It should look like:**
```
mongodb://anveshadwivedi10_db_user:NudKAGrglqetmGxW@cluster0-shard-00-00.yzm1j0j.mongodb.net:27017,cluster0-shard-00-01.yzm1j0j.mongodb.net:27017,cluster0-shard-00-02.yzm1j0j.mongodb.net:27017/ugo-db?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

**Key difference:** Uses `mongodb://` (standard) instead of `mongodb+srv://` (DNS SRV)

---

## Alternative: Manual Connection String

If you can't get the standard string from Atlas, use this format:

```
mongodb://anveshadwivedi10_db_user:NudKAGrglqetmGxW@cluster0-shard-00-00.yzm1j0j.mongodb.net:27017,cluster0-shard-00-01.yzm1j0j.mongodb.net:27017,cluster0-shard-00-02.yzm1j0j.mongodb.net:27017/ugo-db?ssl=true&replicaSet=atlas-abcdef-shard-0&authSource=admin&retryWrites=true&w=majority
```

**Note:** You'll need to find your actual `replicaSet` name from MongoDB Atlas.

---

## After Getting Standard String:

**Update `backend/.env`:**
```env
MONGO_URI=mongodb://anveshadwivedi10_db_user:NudKAGrglqetmGxW@cluster0-shard-00-00.yzm1j0j.mongodb.net:27017,cluster0-shard-00-01.yzm1j0j.mongodb.net:27017,cluster0-shard-00-02.yzm1j0j.mongodb.net:27017/ugo-db?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

**Then:**
```bash
cd backend
node test-connection.js
```

Should connect! ✅

---

## Why This Works:

| Format | Requires DNS SRV? | Works with ISP blocking? |
|--------|-------------------|--------------------------|
| `mongodb+srv://` | ✅ Yes (blocked) | ❌ No |
| `mongodb://` | ❌ No | ✅ Yes |

The standard format directly specifies the server addresses, bypassing DNS SRV lookups.

---

**Get the standard connection string from MongoDB Atlas and I'll update your .env file!** 📝
