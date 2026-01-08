const express = require('express');
const { limiter, getBuckets, clearBuckets } = require('./limiter');

const app = express();
const PORT = process.env.PORT || 3003;

// `limiter` middleware is provided by `src/limiter.js` (wraps express-rate-limit)

app.use(express.json());

app.get('/', (req, res) =>
  res.send('Rate limit example running (using express-rate-limit)')
);

// Unprotected endpoint
app.get('/open', (req, res) => res.json({ open: true }));

// Protected endpoint (rate limited)
app.get('/limited', limiter, (req, res) => {
  res.json({ ok: true, when: new Date().toISOString() });
});

// Admin endpoints for introspection (dev only)
app.get('/buckets', (req, res) => res.json(getBuckets()));
app.post('/buckets/clear', (req, res) => {
  clearBuckets();
  res.json({ cleared: true });
});

app.listen(PORT, () => console.log(`rate-limit example listening on ${PORT}`));
