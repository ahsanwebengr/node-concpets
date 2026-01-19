# MongoDB Setup for ACID Transactions

## Option 1: Local MongoDB Installation (Recommended)

### Step 1: Install MongoDB

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Make sure `mongod` and `mongosh` are in your PATH

### Step 2: Start MongoDB as Replica Set

```bash
# Terminal 1: Start MongoDB
.\start-mongodb.bat

# Terminal 2: Initialize replica set
.\setup-replica.bat
```

### Step 3: Test Your API

```bash
npm start
```

## Option 2: MongoDB Atlas (Cloud - Easier)

### Step 1: Create Free Atlas Account

1. Go to: https://www.mongodb.com/atlas
2. Create free account (M0 cluster)
3. Create a cluster (free tier)

### Step 2: Get Connection String

1. Click "Connect" → "Connect your application"
2. Copy the connection string
3. Replace `<password>` with your database user password

### Step 3: Update Database Connection

Edit `src/config/db.js`:

```javascript
export const connectDB = async () => {
  await mongoose.connect('YOUR_ATLAS_CONNECTION_STRING');
  console.log('MongoDB Atlas connected');
};
```

### Step 4: Test Your API

```bash
npm start
```

## Option 3: Quick Test Without Transactions

If you want to test the API without transactions, you can modify the transfer route to work without ACID transactions:

```javascript
// Remove transaction code and use simple operations
router.post('/transfer', async (req, res) => {
  // ... validation code ...

  try {
    const sender = await Account.findOne({ name: from });
    const receiver = await Account.findOne({ name: to });

    // ... validation code ...

    // Simple transfer without transactions
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // ... rest of code ...
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Current Error Solution

The error "Transaction numbers are only allowed on a replica set member" occurs because:

- MongoDB requires replica sets for ACID transactions
- Your current MongoDB is running as a standalone instance
- Use Option 1 or 2 above to fix this

## Files Created:

- `mongod.conf` - MongoDB configuration
- `start-mongodb.bat` - Start MongoDB script
- `setup-replica.bat` - Initialize replica set script
