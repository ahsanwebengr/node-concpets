# Postman Collection Import Instructions

## How to Import the MongoDB ACID API Collection

### Step 1: Open Postman

Launch Postman on your computer.

### Step 2: Import Collection

1. Click the **"Import"** button in the top left corner
2. Select **"File"** tab
3. Click **"Upload Files"**
4. Select the file: `MongoDB_ACID_API.postman_collection.json`
5. Click **"Import"**

### Step 3: Set Environment Variable

1. Click on **"Environments"** in the left sidebar
2. Click **"Create Environment"**
3. Name it: `MongoDB ACID API`
4. Add variable:
   - **Variable name**: `base_url`
   - **Initial value**: `http://localhost:3000`
   - **Current value**: `http://localhost:3000`
5. Click **"Save"**

### Step 4: Select Environment

1. In the top right corner, select the environment you just created from the dropdown

### Step 5: Start Testing

The collection includes:

- ✅ Health check
- ✅ Database reset
- ✅ Account management
- ✅ Money transfers (success & error cases)
- ✅ Transaction history
- ✅ Complete ACID demonstration flow

### Test Scenarios Included:

1. **Success Case**: Transfer $100 from Alice to Bob
2. **Insufficient Funds**: Try to transfer more than available balance
3. **Invalid Account**: Transfer from non-existent account
4. **Invalid Amount**: Transfer negative amount
5. **Complete Flow**: Reset → Transfer → Verify → Check History

### Running the API

Before testing, make sure your API is running:

```bash
cd acid-properties
npm install
npm start
```

The API will be available at `http://localhost:3000`

### Troubleshooting

- **Connection Refused**: Make sure the API server is running on port 3000
- **MongoDB Connection**: Ensure MongoDB is running on localhost:27017
- **Import Errors**: Make sure you're importing the corrected JSON file

---

**File**: `MongoDB_ACID_API.postman_collection.json`
**Environment Variable**: `base_url = http://localhost:3000`
