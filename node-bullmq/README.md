# BullMQ Email Queue Example

This example shows how to enqueue email jobs with a producer and process them with a worker using BullMQ and Redis. The worker uses `nodemailer` and falls back to an Ethereal test account when no SMTP settings are provided.

Prerequisites

- Redis running and reachable (example using Docker):

```bash
docker run -p 6379:6379 --name redis -d redis:7
```

Setup

```powershell
cd node-bullmq
npm install
copy .env.example .env
# fill .env if you want to use real SMTP credentials
```

Run

- Start producer only (exposes HTTP API to enqueue emails):

```powershell
npm run start:producer
```

- Start worker only (processes queued emails):

```powershell
npm run start:worker
```

- Start both (demo runner forks both processes):

```powershell
npm run start:all
```

Producer API

- `POST /enqueue-email` (JSON body):

```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "Plain text",
  "html": "<b>HTML</b>"
}
```

Notes

- Worker will log an Ethereal preview URL when using the test account — open it in a browser to view the message.
- For production use a persistent Redis and configure SMTP credentials in `.env`.
