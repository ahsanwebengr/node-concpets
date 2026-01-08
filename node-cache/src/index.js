const express = require('express');
const { getOrFetch, getStats, del, get, set, keys } = require('./cache');
const { fetchSampleRemote } = require('./fetcher');

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());

app.get('/', (req, res) => res.send('node-cache example running'));

// Return cached data or fetch and cache it for `ttl` seconds (query param)
app.get('/data', async (req, res) => {
  const ttl = parseInt(req.query.ttl || '60', 10);
  try {
    const data = await getOrFetch('sample:todo', ttl, fetchSampleRemote);
    res.json({ cached: true, ttl, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Invalidate a key
app.get('/invalidate', (req, res) => {
  const key = req.query.key || 'sample:todo';
  del(key);
  res.json({ invalidated: key });
});

// CRUD endpoints for cache
// Create / Update (set) a key
app.post('/cache', (req, res) => {
  const { key, value, ttl } = req.body;
  if (!key) return res.status(400).json({ error: 'key required' });
  set(key, value, ttl || 0);
  res.json({ ok: true, key, ttl: ttl || 0 });
});

// Read a key
app.get('/cache/:key', (req, res) => {
  const key = req.params.key;
  const val = get(key);
  if (val === undefined) return res.status(404).json({ found: false });
  res.json({ found: true, key, value: val });
});

// Update existing key (alias to set)
app.put('/cache/:key', (req, res) => {
  const key = req.params.key;
  const { value, ttl } = req.body;
  set(key, value, ttl || 0);
  res.json({ ok: true, key, ttl: ttl || 0 });
});

// Delete a key
app.delete('/cache/:key', (req, res) => {
  const key = req.params.key;
  del(key);
  res.json({ deleted: key });
});

// List keys
app.get('/keys', (req, res) => {
  res.json({ keys: keys() });
});

// Simple stats
app.get('/stats', (req, res) => res.json(getStats()));

app.listen(PORT, () => console.log(`node-cache example listening on ${PORT}`));
