# Node Rate Limit Example

Simple token-bucket rate limiter example for Node.js + Express.

Setup

```powershell
cd node-rate-limit
npm install
npm start
```

Endpoints

- `GET /open` — unprotected endpoint
- `GET /limited` — protected by rate limiter (default: 10 requests per 60s per IP or `X-API-KEY`)
- `GET /buckets` — view in-memory buckets (for dev/testing)
- `POST /buckets/clear` — clear all buckets

Configuration

- Edit `src/index.js` to change the limiter: `createLimiter({ tokens: 20, interval: 60 })` for 20 reqs/min.

Notes

- This is an in-memory limiter suitable for single-process development and small deployments. For multiple processes or distributed systems use Redis or a centralized store.
- The middleware sets headers `X-RateLimit-Limit` and `X-RateLimit-Remaining`.

Testing

```bash
# hit the limited endpoint repeatedly
for i in {1..15}; do curl -i http://localhost:3003/limited; echo; done
```
