import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
// import transferRoutes from './routes/transfer.js'; // ACID transactions version
import transferRoutes from './routes/transfer-no-transactions.js'; // Non-transaction version for testing

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', transferRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MongoDB ACID Properties API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MongoDB ACID Properties API',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check',
      'GET /api/accounts': 'Get all accounts',
      'POST /api/accounts': 'Create new account',
      'POST /api/transfer': 'Transfer money between accounts',
      'GET /api/transactions': 'Get transaction history',
      'POST /api/reset': 'Reset database with sample data',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Connect to database and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
