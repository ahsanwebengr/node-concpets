# Node Cache Example

This folder demonstrates a realistic in-memory cache wrapper using `node-cache` and a small Express app to exercise it.

Setup

```powershell
cd node-cache
npm install
npm start
```

Endpoints

- `GET /data?ttl=60` — returns cached data from `sample:todo`, fetches from remote if missing, caches for `ttl` seconds (default 60).
- `GET /invalidate?key=sample:todo` — invalidates the key.
- `GET /stats` — cache stats / keys.

CRUD (Cache) endpoints

- `POST /cache` — create or set a key

  Request JSON body: `{ "key": "sample:todo", "value": { ... }, "ttl": 60 }`

- `GET /cache/:key` — read a key

- `PUT /cache/:key` — update (set) a key with JSON body `{ "value": ..., "ttl": 120 }`

- `DELETE /cache/:key` — delete a key

- `GET /keys` — list all cached keys

Examples (curl)

```bash
# set a key
curl -X POST -H "Content-Type: application/json" -d '{"key":"foo","value":{"x":1},"ttl":30}' http://localhost:3002/cache

# get a key
curl http://localhost:3002/cache/foo

# delete a key
curl -X DELETE http://localhost:3002/cache/foo

# list keys
curl http://localhost:3002/keys
```

Design notes

- Uses `node-cache` as an in-memory store with TTL support.
- `getOrFetch(key, ttl, fetcher)` avoids duplicate outbound calls by tracking inflight promises.
- Simple to extend: add background refresh, stale-while-revalidate, or Redis-backed caching for distributed setups.

Pros / Cons

- Pros: fast, simple, predictable TTL behavior.
- Cons: memory-limited, not shared across processes; use Redis or another external store for clustered apps.
