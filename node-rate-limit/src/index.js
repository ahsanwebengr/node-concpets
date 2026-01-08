const express = require('express');
const { createLimiter, getBuckets, clearBuckets } = require('./limiter');

const app = express();
const PORT = process.env.PORT || 3003;

// Default limiter: 10 requests per 60 seconds per key/IP
const limiter = createLimiter({ tokens: 10, interval: 60 });

app.use(express.json());

app.get('/', (req, res) => res.send('Rate limit example running'));

// Unprotected endpoint
app.get('/open', (req, res) => res.json({ open: true }));

// Protected endpoint (rate limited)
app.get('/limited', limiter, (req, res) => {
  res.json({ ok: true, when: new Date().toISOString() });
});

// Admin endpoints for introspection (local/dev only)
app.get('/buckets', (req, res) => res.json(getBuckets()));
app.post('/buckets/clear', (req, res) => {
  clearBuckets();
  res.json({ cleared: true });
});

app.listen(PORT, () => console.log(`rate-limit example listening on ${PORT}`));
