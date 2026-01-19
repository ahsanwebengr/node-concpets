# MongoDB ACID Properties API

## Overview

A complete REST API demonstrating ACID properties in MongoDB through money transfer operations. This project showcases how MongoDB ensures **Atomicity**, **Consistency**, **Isolation**, and **Durability** in real-world banking scenarios.

**ACID** stands for:

- **Atomicity**: All operations succeed or all fail
- **Consistency**: Database maintains valid state
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed data persists permanently

## Features

- ✅ **Money Transfer API** with ACID compliance
- ✅ **Account Management** (create, view accounts)
- ✅ **Transaction History** tracking
- ✅ **Error Handling** with proper rollback
- ✅ **Input Validation** and sanitization
- ✅ **Postman Collection** for easy testing
- ✅ **Database Reset** functionality for testing

## Project Structure

```
acid-properties/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── account.js         # Account schema
│   │   └── transaction.js     # Transaction schema
│   ├── routes/
│   │   └── transfer.js        # API routes
│   └── index.js               # Express server
├── MongoDB_ACID_API.postman_collection.json
├── package.json
└── README.md
```

## Installation

```bash
# Install dependencies
npm install

# Set up MongoDB (choose one option below)
```

## MongoDB Setup (Required for ACID Transactions)

**⚠️ IMPORTANT:** MongoDB requires a replica set for ACID transactions. Choose one of the following options:

### Option 1: Local MongoDB with Replica Set (Recommended)

1. **Install MongoDB Community Server** from: https://www.mongodb.com/try/download/community
2. **Start MongoDB as replica set:**

   ```bash
   # Terminal 1
   .\start-mongodb.bat

   # Terminal 2
   .\setup-replica.bat
   ```

3. **Switch to ACID version:** In `src/index.js`, change:
   ```javascript
   // import transferRoutes from './routes/transfer-no-transactions.js'; // Non-transaction version
   import transferRoutes from './routes/transfer.js'; // ACID transactions version
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at: https://www.mongodb.com/atlas
2. Get connection string and update `src/config/db.js`
3. Use ACID transaction version

### Option 3: Test Without Transactions (Current Setup)

The API currently uses non-transaction version for immediate testing. To enable ACID transactions, set up MongoDB as replica set using Option 1 or 2.

## Usage

### Start the Server

```bash
npm start
```

The API will be available at `http://localhost:3000`

### API Endpoints

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/`                 | API information                 |
| GET    | `/health`           | Health check                    |
| POST   | `/api/reset`        | Reset database with sample data |
| GET    | `/api/accounts`     | Get all accounts                |
| POST   | `/api/accounts`     | Create new account              |
| POST   | `/api/transfer`     | Transfer money between accounts |
| GET    | `/api/transactions` | Get transaction history         |

### Sample API Usage

#### 1. Reset Database

```bash
curl -X POST http://localhost:3000/api/reset
```

#### 2. Check Accounts

```bash
curl http://localhost:3000/api/accounts
```

#### 3. Transfer Money

```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Alice",
    "to": "Bob",
    "amount": 100
  }'
```

## Postman Collection

Import `MongoDB_ACID_API.postman_collection.json` into Postman to test the API.

### Environment Variables

Set `base_url` to `http://localhost:3000` in Postman.

### Test Scenarios Included

1. **Health Check** - Verify API is running
2. **Database Reset** - Initialize with sample data
3. **Account Operations** - Create and view accounts
4. **Successful Transfer** - Valid money transfer
5. **Error Cases**:
   - Insufficient funds
   - Invalid accounts
   - Negative amounts
6. **Transaction History** - View all transfers
7. **Complete Flow** - End-to-end ACID demonstration

## ACID Properties Demonstration

### Atomicity Example

```javascript
// POST /api/transfer
{
  "from": "Alice",
  "to": "Bob",
  "amount": 100
}
```

**Result**: Either Alice loses $100 AND Bob gains $100, or neither happens.

### Consistency Example

The total balance across all accounts remains consistent after operations.

### Isolation Example

Multiple concurrent transfers don't interfere with each other.

### Durability Example

Once a transfer is confirmed, the data persists even if the server crashes.

## Database Schema

### Account

```javascript
{
  name: String (required, unique),
  balance: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction

```javascript
{
  from: String (required),
  to: String (required),
  amount: Number (required, min: 0.01),
  timestamp: Date,
  status: String (enum: ['pending', 'completed', 'failed']),
  description: String
}
```

## Error Handling

The API provides detailed error messages:

```json
{
  "error": "Insufficient balance. Available: $500, Required: $1000"
}
```

Common errors:

- Account not found
- Insufficient balance
- Invalid amount
- Database connection issues

## Development

```bash
# Run in development mode with auto-restart
npm run dev
```

## Testing

Use the Postman collection to test all scenarios:

1. Reset database
2. Create accounts
3. Perform transfers
4. Check error cases
5. Verify transaction history

## Requirements

- Node.js 16+
- MongoDB 4.0+ (with replica set for full ACID compliance)
- For development: Single-node replica set

## MongoDB Setup

For full ACID compliance in development:

```bash
# Start MongoDB with replica set
mongod --replSet rs0 --dbpath /data/db

# In mongo shell:
rs.initiate()
```

## License

MIT

```javascript
const session1 = client.startSession();
const session2 = client.startSession();

// Transaction 1 reads at one point in time
// Transaction 2 reads at another point in time
// Neither sees uncommitted changes from the other
```

### 4. **Durability**

Once committed, data persists even on failure.

**Example:**

```javascript
await db.collection('accounts').insertOne(data, {
  w: 'majority', // Wait for majority to acknowledge
});
// Data is now permanent
```

---

## Project Structure

```
acid-properties/
├── database.js          # Database connection setup
├── examples.js          # All ACID examples
├── index.js             # Main entry point
├── package.json         # Project dependencies
└── README.md            # This file
```

---

## Installation

```bash
npm install mongodb
```

---

## Usage

### Setup MongoDB

**Using Docker:**

```bash
docker run -d -p 27017:27017 --name mongo mongo:latest
```

**Or locally:**

```bash
# Make sure MongoDB is running on localhost:27017
```

### Run Examples

```bash
npm start
```

This will run all ACID property demonstrations.

---

## Detailed Examples

### Example 1: Account Transfer (Atomicity)

**Scenario:** Transfer $100 from Alice to Bob

**Code:**

```javascript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    // Step 1: Deduct from Alice
    await db
      .collection('accounts')
      .updateOne({ _id: 'accountA' }, { $inc: { balance: -100 } }, { session });

    // Step 2: Add to Bob
    await db
      .collection('accounts')
      .updateOne({ _id: 'accountB' }, { $inc: { balance: 100 } }, { session });

    // Both succeed or both fail
  });
} finally {
  await session.endSession();
}
```

**Result:**

```
Alice: $900 (was $1000)
Bob:   $600 (was $500)
✓ Transaction committed successfully
```

---

### Example 2: Multi-Recipient Payment

**Scenario:** Split a $300 payment from Alice to Bob and Charlie (50/50)

**Code:**

```javascript
const session = client.startSession();

await session.withTransaction(async () => {
  // Check sufficient funds
  const alice = await db.collection('accounts').findOne({ _id: 'alice' }, { session });

  if (alice.balance < 300) {
    throw new Error('Insufficient funds');
  }

  // Deduct from Alice
  await db
    .collection('accounts')
    .updateOne({ _id: 'alice' }, { $inc: { balance: -300 } }, { session });

  // Transfer to Bob
  await db
    .collection('accounts')
    .updateOne({ _id: 'bob' }, { $inc: { balance: 150 } }, { session });

  // Transfer to Charlie
  await db
    .collection('accounts')
    .updateOne({ _id: 'charlie' }, { $inc: { balance: 150 } }, { session });

  // Record in ledger
  await db.collection('transactions').insertOne(
    {
      from: 'alice',
      to: ['bob', 'charlie'],
      amounts: [150, 150],
      totalAmount: 300,
      timestamp: new Date(),
      status: 'completed',
    },
    { session },
  );
});
```

**Result:**

```
Alice:   $700  (was $1000)
Bob:     $650  (was $500)
Charlie: $2150 (was $2000)
✓ All updates succeeded atomically
```

---

## Key Concepts

### Write Concern

Controls durability of writes:

```javascript
// Default: { w: 1 }
// Acknowledgment from primary node

// Stronger: { w: 'majority' }
// Acknowledgment from majority of replica set

db.collection('accounts').insertOne(data, { w: 'majority' });
```

### Read Concern

Controls consistency of reads:

```javascript
// 'local' (default): Read committed data
// 'majority': Read data committed by majority
// 'snapshot': Read from snapshot in time

await db.collection('accounts').findOne(
  {},
  {
    readConcern: { level: 'snapshot' },
    session,
  },
);
```

### Transaction Isolation Level

MongoDB uses **Snapshot Isolation**:

- Each transaction sees data as it existed at the start
- No dirty reads, non-repeatable reads, or phantoms
- Serializable for single document operations

---

## MongoDB Requirements

- **Version:** 4.0+ for single-node, 4.2+ for sharded clusters
- **Replica Set:** Transactions require a replica set (even single-node replica set)
- **Storage Engine:** WiredTiger only

---

## Testing

Run individual examples:

```javascript
const { demoAtomicity } = require('./examples');
const { connectDB, disconnectDB } = require('./database');

await connectDB();
await demoAtomicity();
await disconnectDB();
```

---

## Real-World Use Cases

1. **Banking:** Fund transfers between accounts
2. **E-commerce:** Inventory deduction + order creation
3. **Payments:** Charge card + award loyalty points
4. **Accounting:** Multiple ledger entries
5. **Reservations:** Check availability + book + update inventory

---

## Common Pitfalls

❌ **Don't:** Forget to pass `session` to operations

```javascript
// WRONG
await db.collection('accounts').updateOne({ ... });
```

✓ **Do:** Include session in all operations

```javascript
// CORRECT
await db.collection('accounts').updateOne({ ... }, { session });
```

---

## References

- [MongoDB Transactions Documentation](https://docs.mongodb.com/manual/core/transactions/)
- [MongoDB ACID Compliance](https://www.mongodb.com/transactions)
- [Node.js MongoDB Driver](https://github.com/mongodb/node-mongodb-native)

---

## License

MIT
