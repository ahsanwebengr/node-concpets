const express = require('express');
const { Queue } = require('bullmq');
const dotenv = require('dotenv');

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const PORT = process.env.PORT_PRODUCER || process.env.PORT || 3010;

const emailQueue = new Queue('email-queue', { connection: { url: REDIS_URL } });

const app = express();
app.use(express.json());

// Enqueue an email job. Body: { to, subject, text, html }
app.post('/enqueue-email', async (req, res) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject || (!text && !html))
    return res.status(400).json({ error: 'to, subject and text/html required' });

  try {
    const job = await emailQueue.add(
      'send-email',
      { to, subject, text, html },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
    );
    return res.json({ ok: true, jobId: job.id });
  } catch (err) {
    console.error('enqueue error', err);
    return res.status(500).json({ error: err.message || 'enqueue failed' });
  }
});

app.get('/', (req, res) => res.json({ status: 'producer running' }));

app.listen(PORT, () => console.log(`Producer listening on ${PORT}, Redis: ${REDIS_URL}`));

process.on('SIGINT', async () => {
  console.log('Producer shutting down');
  await emailQueue.close();
  process.exit(0);
});
