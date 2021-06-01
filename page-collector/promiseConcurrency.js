const EventEmitter = require('events');
const fs = require('fs');
const { uuidv4 } = require('./uuidv4');
const { printTable } = require('console-table-printer');
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(30);
let batchConcur = 0;
let totalConcur = 0;
let queue = [];
let promises = [];
let rejected = [];
let resolved = [];
let promiseStates = [
  { state: 'queque', promises: queue },
  { state: 'proccess', promises: promises },
  { state: 'resolved', promises: resolved },
  { state: 'rejected', promises: rejected }
];
eventEmitter.on('promiseResolved', promise => {
  const { uuidv4, batchName, id } = promise;
  resolved.push(promise);
  const promiseToRemoveIndex = promises.findIndex(p => p.id === id);

  promises.splice(promiseToRemoveIndex, 1);

  if (queue.length > 0 && promises.length < totalConcur) {
    const countBatchInProcess = reduceQueue(promises)[batchName].length;
    if (countBatchInProcess === 0) {
    }
    if (countBatchInProcess < batchConcur && reduceQueue(queue)[batchName]) {
      const candidateInqueue = reduceQueue(queue)[batchName][0];

      const nextpromise = candidateInqueue;
      const { uuidv4, promiseName } = nextpromise;
      promises.push(nextpromise);
      const queueToRemoveIndex = queue.findIndex(
        p => p.id === candidateInqueue.id
      );

      queue.splice(queueToRemoveIndex, 1);
      nextpromise({ uuidv4, batchName, promiseName });
    } else {
      const avaiablePromises = Object.entries(reduceQueue(queue)).filter(f => {
        const bName = f[0];
        if (bName !== batchName) {
          return f;
        }
      });
      const nextpromise = avaiablePromises[0][1][0];
      const { uuidv4, promiseName } = nextpromise;
      const queueToRemoveIndex = queue.findIndex(p => p.id === nextpromise.id);
      queue.splice(queueToRemoveIndex, 1);
      nextpromise({ uuidv4, batchName, promiseName });
    }
  }
  updateConsoleTable(promiseStates);
});
eventEmitter.on('promiseRejected', promise => {
  const { batchName, url, error } = promise;
  const { message } = error;
  const result = { errorMessage: message, url, batchName };

  let filePath = `${process.cwd()}/page-result/page-collection-result.json`;
  let dataObject = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    dataObject = JSON.parse(data);
    dataObject.push(result);
  } else {
    dataObject.push(result);
  }
  fs.writeFileSync(filePath, JSON.stringify(dataObject));

  rejected.push(promise);
  promises.shift();
  updateConsoleTable(promiseStates);
});
eventEmitter.on('promiseAttached', promise => {
  const { uuidv4: pageId, batchName, promiseName } = promise;
  promise.id = uuidv4();
  const batchCount = promises.filter(q => q.batchName === batchName).length;
  const totalCount = promises.length;
  if (batchCount < batchConcur && totalCount < totalConcur) {
    promises.push(promise);

    promise({ uuidv4: pageId, batchName, promiseName });
    updateConsoleTable(promiseStates);
  } else {
    updateConsoleTable(promiseStates);
    queue.push(promise);
  }
});
function promiseConcurrency({ batchConcurrency, totalConcurrency }) {
  batchConcur = batchConcurrency;
  totalConcur = totalConcurrency;
  totalConcurrency;
}

function updateConsoleTable(items) {
  let reduced = items.reduce((pacc, curr) => {
    const { state, promises } = curr;

    const promiseCounter = promises.reduce((acc, curr) => {
      const { batchName } = curr;
      const testState = acc[batchName];

      if (testState === undefined) {
        const accumilated = pacc[batchName];

        const result = {
          ...acc,
          [batchName]: { ...accumilated, [state]: 1 }
        };

        return result;
      }

      let counter = acc[batchName][state];
      const accumilated = pacc[batchName];

      const result = {
        ...acc,
        [batchName]: { ...accumilated, [state]: ++counter }
      };

      return result;
    }, {});

    const result = { ...pacc, ...promiseCounter };

    return result;
  }, {});
  const rows = [];
  for (let state in reduced) {
    let row = {};
    const current = reduced[state];
    row['batchName'] = state;

    for (let subState in current) {
      const value = current[subState];
      row[subState] = value;
    }
    rows.push(row);
  }

  console.clear();
  printTable(rows);

  promiseExecCompleted();
}
function promiseExecCompleted() {
  if (queue.length === 0 && promises.length === 0) {
    eventEmitter.emit('promiseExecCompleted');
    console.log('promiseExecCompleted');
  }
}

function reduceQueue(promisesInQueue) {
  const result = groupBy(promisesInQueue, 'batchName');

  return result;
}

function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

function invokeNextPromise() {}
module.exports = {
  promiseConcurrency,
  eventEmitter,
  updateConsoleTable,
  reduceQueue
};
