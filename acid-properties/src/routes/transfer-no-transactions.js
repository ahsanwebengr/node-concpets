import express from 'express';
import Account from '../models/account.js';
import Transaction from '../models/transaction.js';

const router = express.Router();

// POST /api/transfer - Transfer money between accounts (WITHOUT transactions for testing)
router.post('/transfer', async (req, res) => {
  const { from, to, amount } = req.body;

  // Input validation
  if (!from || !to || !amount) {
    return res.status(400).json({
      error: 'Missing required fields: from, to, amount',
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      error: 'Amount must be positive',
    });
  }

  try {
    // Find both accounts
    const sender = await Account.findOne({ name: from });
    const receiver = await Account.findOne({ name: to });

    if (!sender) {
      throw new Error(`Sender account '${from}' not found`);
    }

    if (!receiver) {
      throw new Error(`Receiver account '${to}' not found`);
    }

    if (sender.balance < amount) {
      throw new Error(
        `Insufficient balance. Available: $${sender.balance}, Required: $${amount}`,
      );
    }

    // Perform the transfer (without transactions)
    sender.balance -= amount;
    receiver.balance += amount;

    // Save both accounts
    await sender.save();
    await receiver.save();

    // Create transaction record
    await Transaction.create({
      from,
      to,
      amount,
      description: `Transfer from ${from} to ${to}`,
    });

    res.json({
      message: 'Transfer successful (without ACID transactions)',
      details: {
        from: sender.name,
        to: receiver.name,
        amount: amount,
        senderBalance: sender.balance,
        receiverBalance: receiver.balance,
      },
      note: 'This version does not use ACID transactions. Set up MongoDB replica set for full ACID compliance.',
    });
  } catch (error) {
    console.error('Transfer failed:', error.message);
    res.status(400).json({
      error: error.message,
    });
  }
});

// GET /api/accounts - Get all accounts
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await Account.find({}, { _id: 0, __v: 0 });
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/accounts - Create new account
router.post('/accounts', async (req, res) => {
  const { name, balance = 0 } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Account name is required' });
  }

  try {
    const existingAccount = await Account.findOne({ name });
    if (existingAccount) {
      return res.status(400).json({ error: 'Account already exists' });
    }

    const account = new Account({ name, balance });
    await account.save();

    res.status(201).json({
      message: 'Account created successfully',
      account: { name: account.name, balance: account.balance },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions - Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({}, { _id: 0, __v: 0 })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reset - Reset all data (for testing)
router.post('/reset', async (req, res) => {
  try {
    await Account.deleteMany({});
    await Transaction.deleteMany({});

    // Create sample accounts
    const sampleAccounts = [
      { name: 'Alice', balance: 1000 },
      { name: 'Bob', balance: 500 },
      { name: 'Charlie', balance: 2000 },
    ];

    await Account.insertMany(sampleAccounts);

    res.json({
      message: 'Database reset successfully',
      sampleAccounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
