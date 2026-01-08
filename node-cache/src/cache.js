const NodeCache = require('node-cache');

// Default cache (seconds)
const cache = new NodeCache({ stdTTL: 0, checkperiod: 60 });

// Track inflight fetches to avoid duplicate remote calls
const inflight = new Map();

function get(key) {
  return cache.get(key);
}

function set(key, value, ttlSeconds) {
  return cache.set(key, value, ttlSeconds);
}

function del(key) {
  return cache.del(key);
}

function keys() {
  return cache.keys();
}

function getStats() {
  if (typeof cache.getStats === 'function') return cache.getStats();
  return { keys: cache.keys().length };
}

/**
 * getOrFetch - returns cached value or calls fetcher to populate cache
 * - avoids duplicate fetches by sharing inflight promise
 * - sets TTL on successful fetch
 */
async function getOrFetch(key, ttlSeconds, fetcher) {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const p = (async () => {
    try {
      const data = await fetcher();
      cache.set(key, data, ttlSeconds);
      return data;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}

module.exports = { get, set, del, keys, getStats, getOrFetch };
