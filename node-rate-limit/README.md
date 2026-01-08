# Node Rate Limit Example

Rate limiter example for Node.js + Express using the `express-rate-limit` npm package (token-bucket style behaviour).

Setup

```powershell
cd node-rate-limit
npm install
npm start
```

Endpoints

- `GET /open` — unprotected endpoint
- `GET /limited` — protected by rate limiter (default: 10 requests per 60s per IP or `X-API-KEY`)
- `GET /limited` — protected by rate limiter (default: 10 requests per 60s per IP).
- `GET /buckets` — view in-memory buckets (for dev/testing; reflects custom limiter state if used).
- `POST /buckets/clear` — clear all buckets

Configuration

-- Edit `src/index.js` to change the limiter configuration. Example using `express-rate-limit`:

```js
const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
```

Notes

- This is an in-memory limiter suitable for single-process development and small deployments. For multiple processes or distributed systems use Redis or a centralized store.
- The middleware sets headers `X-RateLimit-Limit` and `X-RateLimit-Remaining`.

Testing

```bash
# hit the limited endpoint repeatedly
for i in {1..15}; do curl -i http://localhost:3003/limited; echo; done
```
