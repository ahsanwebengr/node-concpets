const rateLimit = require('express-rate-limit');

// Use express-rate-limit under the hood and maintain a lightweight
// introspection map so admin endpoints can observe recent usage.
const buckets = new Map();

const defaultOptions = {
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'Too Many Requests' }),
};

const rl = rateLimit(defaultOptions);

function limiter(req, res, next) {
  // Call the underlying rate-limit middleware and capture headers it sets
  rl(req, res, function (err) {
    if (err) return next(err);

    const key = req.headers['x-api-key'] || req.ip;
    const remainingRaw =
      res.getHeader('RateLimit-Remaining') || res.getHeader('X-RateLimit-Remaining');
    const limitRaw =
      res.getHeader('RateLimit-Limit') || res.getHeader('X-RateLimit-Limit');
    const remaining = remainingRaw !== undefined ? Number(remainingRaw) : null;
    const limit = limitRaw !== undefined ? Number(limitRaw) : defaultOptions.max;

    buckets.set(key, { remaining, limit, updated: Date.now() });
    return next();
  });
}

function getBuckets() {
  const out = {};
  for (const [k, v] of buckets.entries()) {
    out[k] = { remaining: v.remaining, limit: v.limit, updated: v.updated };
  }
  return out;
}

function clearBuckets() {
  buckets.clear();
}

module.exports = { limiter, getBuckets, clearBuckets };
