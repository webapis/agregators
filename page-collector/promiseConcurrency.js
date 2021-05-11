const EventEmitter = require('events');
const { uuidv4 } = require('./uuidv4');
const eventEmitter = new EventEmitter();

let batchConcur = 0;
let totalConcur = 0;
let queue = [];
let promises = [];
eventEmitter.on('promiseResolved', promise => {
  const { uuidv4 } = promise;

  const promiseToRemoveIndex = promises.findIndex(p => p.uuidv4 === uuidv4);

  promises.splice(promiseToRemoveIndex, 1);
  if (queue.length > 0) {
    const nextpromise = queue[0];

    promises.push(nextpromise);
    queue.shift();
    nextpromise()
      .then(() => {
        eventEmitter.emit('promiseResolved', promise);
      })
      .catch(error => {
        console.log('error fetching image', error);
        eventEmitter.emit('promiseRejected', { promise, error });
      });

    console.log('queue length', queue.length);
    console.log('promises length', promises.length);
  } else {
    console.log('queue is complete');
  }
});
eventEmitter.on('promiseRejected', () => {
  console.log('promiseRejected');
});
eventEmitter.on('promiseAttached', promise => {
  const { batchName } = promise;

  const batchCount = promises.filter(q => q.batchName === batchName).length;
  const totalCount = promises.length;
  if (batchCount <= batchConcur && totalCount <= totalConcur) {
    promises.push(promise);

    promise()
      .then(() => {
        eventEmitter.emit('promiseResolved', promise);
      })
      .catch(error => {
        console.log('error fetching image', error);
        eventEmitter.emit('promiseRejected', { promise, error });
      });
  } else {
    queue.push(promise);
  }
});
function promiseConcurrency({ batchConcurrency, totalConcurrency }) {
  batchConcur = batchConcurrency;
  totalConcur = totalConcurrency;
  totalConcurrency;
  return ({ batchName, promise }) => {
    promise.uuidv4 = uuidv4();
    promise.batchName = batchName;

    eventEmitter.emit('promiseAttached', promise);
  };
}

module.exports = { promiseConcurrency };
