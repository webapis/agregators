const EventEmitter = require('events');
const fs = require('fs');
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
  const { uuidv4 } = promise;
  resolved.push(promise);
  const promiseToRemoveIndex = promises.findIndex(p => p.uuidv4 === uuidv4);

  promises.splice(promiseToRemoveIndex, 1);
  if (queue.length > 0) {
    const nextpromise = queue[0];
    const { uuidv4, batchName, promiseName } = nextpromise;

    promises.push(nextpromise);
    queue.shift();
    nextpromise({ uuidv4, batchName, promiseName });
  }
  updateConsoleTable(promiseStates);
});
eventEmitter.on('promiseRejected', promise => {
  const { batchName, url, error } = promise;
  const { message } = error;
  const result = { errorMessage: message, url, batchName };
  debugger;
  let filePath = `${process.cwd()}/page-result/page-collection-result.json`;
  let dataObject = [];
  if (fs.existsSync(filePath)) {
    debugger;
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    dataObject = JSON.parse(data);
    dataObject.push(result);
  } else {
    debugger;
    dataObject.push(result);
  }
  fs.writeFileSync(filePath, JSON.stringify(dataObject));
  debugger;
  rejected.push(promise);
  promises.shift();
  updateConsoleTable(promiseStates);
});
eventEmitter.on('promiseAttached', promise => {
  const { uuidv4, batchName, promiseName } = promise;

  const batchCount = promises.filter(q => q.batchName === batchName).length;
  const totalCount = promises.length;
  if (batchCount <= batchConcur && totalCount <= totalConcur) {
    promises.push(promise);

    promise({ uuidv4, batchName, promiseName });
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
module.exports = { promiseConcurrency, eventEmitter, updateConsoleTable };
