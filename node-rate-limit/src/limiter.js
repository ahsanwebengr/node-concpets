// Simple in-memory token-bucket rate limiter middleware
// Configurable tokens (capacity) and refill interval (seconds)

const buckets = new Map();

function createLimiter({ tokens = 10, interval = 60 } = {}) {
  // tokens = capacity per interval, interval in seconds
  return function rateLimitMiddleware(req, res, next) {
    const key = req.headers['x-api-key'] || req.ip;
    const now = Date.now();

    const bucket = buckets.get(key) || { tokens: tokens, last: now };
    // refill based on elapsed time
    const elapsed = (now - bucket.last) / 1000;
    const refillTokens = (elapsed / interval) * tokens;
    bucket.tokens = Math.min(tokens, bucket.tokens + refillTokens);
    bucket.last = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      buckets.set(key, bucket);
      res.setHeader('X-RateLimit-Limit', tokens);
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      return next();
    }

    // too many requests
    res.setHeader('X-RateLimit-Limit', tokens);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.status(429).json({ error: 'Too Many Requests' });
  };
}

function getBuckets() {
  const out = {};
  for (const [k, v] of buckets.entries()) {
    out[k] = { tokens: v.tokens, last: v.last };
  }
  return out;
}

function clearBuckets() {
  buckets.clear();
}

module.exports = { createLimiter, getBuckets, clearBuckets };
