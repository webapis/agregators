const { parentPort, workerData, isMainThread } = require('worker_threads');
const { nextSlice, index } = workerData;

console.log(`My index is ${index}`);
parentPort.postMessage(`My index is ${index}`);
