const express = require('express');
const cron = require('node-cron');
const { runHourlyJob, runSundayJob } = require('./cronTask');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Cron job server running. Use /run-hourly or /run-sunday to trigger manually.'));

app.get('/run-hourly', async (req, res) => {
  try {
    const result = await runHourlyJob();
    res.json({ status: 'ok', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/run-sunday', async (req, res) => {
  try {
    const result = await runSundayJob();
    res.json({ status: 'ok', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Schedule: runs every 5 seconds for testing (seconds field supported)
// Pattern: '*/5 * * * * *' => every 5 seconds
// (Removed the test 5s `runJob` schedule.)

// Hourly job: runs at minute 0 of every hour (use seconds-field '0 0 * * * *')
cron.schedule('0 0 * * * *', async () => {
  console.log(new Date().toISOString(), 'Running hourly job');
  try {
    await runHourlyJob();
  } catch (e) {
    console.error('Hourly job failed', e);
  }
});

// Sunday job: runs at 00:00 on Sundays (seconds minute hour day month weekday)
cron.schedule('0 0 0 * * 0', async () => {
  console.log(new Date().toISOString(), 'Running sunday job');
  try {
    await runSundayJob();
  } catch (e) {
    console.error('Sunday job failed', e);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
