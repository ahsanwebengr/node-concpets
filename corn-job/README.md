# Corn Job (Cron Job) Example

This repository demonstrates a simple Node.js server with a scheduled job using `node-cron`.
## Files

- `server.js` - Express server and cron scheduler
## Setup

Install dependencies:
```powershell
cd corn-job
npm install
```
Run server:

```powershell
npm start
# or for development with auto-reload
npm run dev
```
## Demo

- By default the scheduled job runs every minute. For testing you can use a seconds-enabled pattern (e.g. `*/5 * * * * *` to run every 5 seconds).
- Trigger the job manually: `GET /run-job`
## Change schedule

Edit the cron pattern in `server.js` (see `cron.schedule(...)`). `node-cron` supports a 6-field expression with seconds: `second minute hour day month weekday`.
Examples:
 # Corn Job (Cron Job) Example

This repository demonstrates a simple Node.js server with a scheduled job using `node-cron`.

## Files

- `server.js` - Express server and cron scheduler
- `cronTask.js` - Example job to run (fetches sample API)
- `package.json` - dependencies and scripts

## Setup

Install dependencies and start the server:

```powershell
cd corn-job
npm install
npm start
```

For development with auto-reload:

```powershell
npm run dev
```

## Demo

 - By default the scheduled job runs every minute. For testing you can use a seconds-enabled pattern (e.g. `*/5 * * * * *`).
 - Manual triggers: `GET /run-hourly` and `GET /run-sunday`

### New jobs

- Hourly time job: runs at the top of every hour and logs the current server time.
  - Cron pattern used: `0 0 * * * *` (seconds minute hour day month weekday)
  - Manual trigger: `GET /run-hourly`

- Sunday off-day job: runs at 00:00 on Sundays and logs that it's an off day.
  - Cron pattern used: `0 0 0 * * 0`
  - Manual trigger: `GET /run-sunday`

## Change schedule

Edit the cron pattern in `server.js` (see `cron.schedule(...)`). `node-cron` supports a 6-field expression with seconds: `second minute hour day month weekday`.

Examples:

- Every minute: `* * * * *`
- Every 5 seconds (testing): `*/5 * * * * *`
- Every day at 02:30: `0 30 2 * * *`

## Pros and Cons

- **Pros:**
  - Simple to implement and reason about.
  - Lightweight: no external orchestration required for basic schedules.
  - Easy local testing using seconds-resolution patterns.

- **Cons / Corns:**
  - Not durable across restarts — schedule runs only while the process is running.
  - Single-process: not safe for distributed/clustered deployments without coordination (risk of duplicate runs).
  - Limited visibility and retry semantics compared to dedicated job queues (e.g., Bull, RabbitMQ).
  - Using very short intervals (seconds) can overload external APIs; use backoff and rate limits.

## Production notes

- Use a process manager (`pm2`, `systemd`, Windows service) to keep the service running and restart on failure.
- For clustered deployments, use a distributed lock (Redis lock, leader election) or external scheduler (Kubernetes CronJob, AWS EventBridge) to avoid duplicate execution.
- Add logging, alerting, and idempotency to the job implementation.

## Running as a background service

- On Linux, use `pm2` or create a `systemd` service.
- On Windows, use `nssm` or `pm2` with its Windows installer.

## Quick test (run every 5 seconds)

Edit `server.js` and set the schedule to `cron.schedule('*/5 * * * * *', ...)` then start the server and watch logs.
- On Linux, use `pm2` or create a `systemd` service.

- On Windows, use `nssm` or `pm2` with its Windows installer.

