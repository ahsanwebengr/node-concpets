const { Worker, QueueScheduler } = require('bullmq');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const queueName = 'email-queue';

// Scheduler to handle delayed and stalled jobs
const scheduler = new QueueScheduler(queueName, { connection: { url: REDIS_URL } });

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  // fallback to Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

async function startWorker() {
  const transporter = await createTransporter();

  const worker = new Worker(
    queueName,
    async job => {
      console.log('Processing job', job.id, job.name);
      const { to, subject, text, html } = job.data;

      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        to,
        subject,
        text,
        html,
      });
      console.log('Email sent for job', job.id, 'messageId', info.messageId);

      // If using Ethereal, provide preview URL
      if (nodemailer.getTestMessageUrl && info) {
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) console.log('Preview URL:', preview);
      }

      return { messageId: info.messageId };
    },
    { connection: { url: REDIS_URL } }
  );

  worker.on('completed', job => console.log('Job completed', job.id));
  worker.on('failed', (job, err) =>
    console.error('Job failed', job ? job.id : null, err)
  );

  process.on('SIGINT', async () => {
    console.log('Worker shutting down');
    await worker.close();
    await scheduler.close();
    process.exit(0);
  });

  console.log('Worker started, listening to', queueName, 'Redis:', REDIS_URL);
}

startWorker().catch(err => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
