const { parentPort, isMainThread, Worker } = require('worker_threads');
let worker = {};
function workerService({ workerData, script }) {

  return new Promise((resolve, reject) => {
    console.log('Message posted to child worker');
    if (isMainThread) {
      worker = new Worker(script, { workerData });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', code => {
        console.log('worker exit',code)
       // reject(new Error(`Worker stopped with exit code ${code}`));
      });
    }
  });
}

module.exports = { workerService };


