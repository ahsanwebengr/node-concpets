async function runHourlyJob() {
  const now = new Date();
  const message = `Current server time: ${now.toISOString()}`;
  console.log('[Hourly Job]', message);
  return { time: now.toISOString(), message };
}

async function runSundayJob() {
  const message = "It's off day — Sunday";
  console.log('[Sunday Job]', message, new Date().toISOString());
  return { message, when: new Date().toISOString() };
}

module.exports = { runHourlyJob, runSundayJob };
