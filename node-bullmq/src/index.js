// Simple starter that launches both producer and worker for demo purposes.
const { fork } = require('child_process');
const path = require('path');

const producer = fork(path.join(__dirname, 'producer.js'));
const worker = fork(path.join(__dirname, 'worker.js'));

producer.on('exit', code => console.log('Producer process exited', code));
worker.on('exit', code => console.log('Worker process exited', code));

process.on('SIGINT', () => {
  console.log('Shutting down demo runner');
  producer.kill('SIGINT');
  worker.kill('SIGINT');
  process.exit(0);
});
