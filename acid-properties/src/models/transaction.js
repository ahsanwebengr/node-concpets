import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
  },
});

// Index for faster queries
transactionSchema.index({ timestamp: -1 });
transactionSchema.index({ from: 1, timestamp: -1 });
transactionSchema.index({ to: 1, timestamp: -1 });

export default mongoose.model('Transaction', transactionSchema);
