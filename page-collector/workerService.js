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
        reject(new Error(`Worker stopped with exit code ${code}`));
      });
    }
  });
}

module.exports = { workerService };

// function createWorker() {
//
//   const worker = new Worker(__filename);
//   worker.parentPort = parentPort;
//   worker.parentPort.on('message', task => {
//
//   });
//
//   worker.on('message', result => {
//
//   });

//   worker.on('error', error => {
//     console.log(error);
//   });

//   worker.on('exit', exitCode => {
//     console.log(exitCode);
//   });

//   return worker;
// }
