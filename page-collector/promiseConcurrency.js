const fs = require('fs');
const { uuidv4 } = require('./uuidv4');
const { printTable } = require('console-table-printer');
const EventEmitter = require('events');

class PromiseEmitter extends EventEmitter {
  constructor(batchConcur, totalConcur) {
    super();
    this.batchConcur = batchConcur;
    this.totalConcur = totalConcur;
    this.queue = [];
    this.promises = [];
    this.rejected = [];
    this.resolved = [];
    this.total = [];
    this.on('promiseAttached', function(promise) {
      debugger;
      const { batchName, id } = promise;
      debugger;
      //1. promises is empty
      if (this.promises.length === 0) {
        debugger;
        promise();

        this.promises.push(promise);
        this.promiseAttachmentHandled();
        return;
      }
      //2. promises is not empty
      //2.1 total promises length limit is reached
      if (this.promises.length === this.totalConcur) {
        debugger;
        this.queue.push(promise);
        this.promiseAttachmentHandled();
        return;
      }
      //2.2 total promises length limit is not reached
      //2.2.1 batch limit is reached
      const batchCount = this.promises.filter(q => q.batchName === batchName)
        .length;

      if (
        this.promises.length < this.totalConcur &&
        batchCount === this.batchConcur
      ) {
        debugger;
        this.queue.push(promise);
        this.promiseAttachmentHandled();
        return;
      }
      //2.2.2 batch limit is not reached
      if (
        this.promises.length < this.totalConcur &&
        batchCount < this.batchConcur
      ) {
        debugger;
        promise();
        this.promises.push(promise);
        this.promiseAttachmentHandled();
        return;
      }
    });
    this.on('setInitialState', initialState => {
      this.promises =
        initialState.promises !== undefined ? initialState.promises : [];
      debugger;
      this.queue = initialState.queue !== undefined ? initialState.queue : [];
    });
  }
  promiseAttachmentHandled() {
    this.emit('promiseAttachmentHandled', {
      queue: this.queue,
      promises: this.promises,
      rejected: this.rejected,
      total: this.total,
      resolved: this.resolved
    });
  }
}
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(30);
let batchConcur = 0;
let totalConcur = 0;
let queue = [];
let promises = [];
let rejected = [];
let resolved = [];
let total = [];
let promiseStates = [
  { state: 'total', promises: total },
  { state: 'queque', promises: queue },
  { state: 'proccess', promises: promises },
  { state: 'resolved', promises: resolved },
  { state: 'rejected', promises: rejected }
];
eventEmitter.on('promiseResolved', promise => {
  resolved.push(promise);
  invokeNextPromise({ promise });
});
eventEmitter.on('promiseRejected', promise => {
  const { batchName, url, error, id } = promise;
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

  const promiseToRemoveIndex = promises.findIndex(p => p.id === id);
  if (promiseToRemoveIndex !== -1) {
    promises.splice(promiseToRemoveIndex, 1);
    //  updateConsoleTable(promiseStates);
    invokeNextPromise({ promise });
  } else {
    debugger;
  }
  updateConsoleTable(promiseStates);
});

function promiseConcurrency({ batchConcurrency, totalConcurrency }) {
  const promiseEmitter = new PromiseEmitter(batchConcurrency, totalConcurrency);
  // promiseEmitter.on('promiseAttached', function(promise) {
  //   const { batchName, id } = promise;
  //   debugger;
  //   //1. promises is empty
  //   if (promises.length === 0) {
  //     debugger;
  //     promise();

  //     promiseEmitter.promises.push(promise);
  //     promiseEmitter.promiseAttachmentHandled();
  //     return;
  //   }
  //   //2. promises is not empty
  //   //2.1 total promises length limit is reached
  //   if (promises.length === totalConcur) {
  //     debugger;
  //     promiseEmitter.queue.push(promise);
  //     promiseEmitter.promiseAttachmentHandled();
  //     return;
  //   }
  //   //2.2 total promises length limit is not reached
  //   //2.2.1 batch limit is reached
  //   const batchCount = promises.filter(q => q.batchName === batchName).length;

  //   if (promises.length < totalConcur && batchCount === batchConcur) {
  //     debugger;
  //     promiseEmitter.queue.push(promise);
  //     promiseEmitter.promiseAttachmentHandled();
  //     return;
  //   }
  //   //2.2.2 batch limit is not reached
  //   if (promises.length < totalConcur && batchCount < batchConcur) {
  //     debugger;
  //     promise();
  //     promiseEmitter.promises.push(promise);
  //     promiseEmitter.promiseAttachmentHandled();
  //     return;
  //   }
  // });

  eventEmitter.on('setInitialState', initialState => {
    promiseEmitter.promises =
      initialState.promises !== undefined ? initialState.promises : [];
    debugger;
    promiseEmitter.queue =
      initialState.queue !== undefined ? initialState.queue : [];
  });

  return promiseEmitter;
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

  // promiseExecCompleted();
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

function invokeNextPromise({ promise }) {
  try {
    const { uuidv4, batchName, id } = promise;

    const promiseToRemoveIndex = promises.findIndex(p => p.id === id);

    promises.splice(promiseToRemoveIndex, 1);
    if (queue.length === 0 && promises.length === 0) {
      updateConsoleTable(promiseStates);
      console.log('---1---');
    }
    if (
      queue.length > 0 &&
      promises.length < totalConcur &&
      reduceQueue(queue)[batchName]
    ) {
      const countBatchInProcess = reduceQueue(promises)[batchName].length;

      if (countBatchInProcess < batchConcur) {
        const freeBatchSpaces = batchConcur - countBatchInProcess;
        if (freeBatchSpaces > 1 && reduceQueue(queue)[batchName].length > 1) {
          let i = 0;
          for (i; i < freeBatchSpaces; i++) {
            const temt = reduceQueue(queue)[batchName];

            if (
              reduceQueue(queue)[batchName] &&
              reduceQueue(queue)[batchName][i]
            ) {
              const candidateInqueue = reduceQueue(queue)[batchName][i];
              if (candidateInqueue) {
                const nextpromise = candidateInqueue;
                const { uuidv4, promiseName, id: nextId } = nextpromise;
                promises.push(nextpromise);
                const queueToRemoveIndex = queue.findIndex(
                  p => p.id === candidateInqueue.id
                );
                queue.splice(queueToRemoveIndex, 1);
                nextpromise({ uuidv4, batchName, promiseName, id: nextId });
                updateConsoleTable(promiseStates);
                console.log('--2---freeBatchSpaces', freeBatchSpaces);
              } else {
                console.log('--2--- empty');
              }
            }
          }
        } else {
          const candidateInqueue = reduceQueue(queue)[batchName][0];
          if (candidateInqueue) {
            const nextpromise = candidateInqueue;
            const { uuidv4, promiseName, id: nextId } = nextpromise;
            promises.push(nextpromise);
            const queueToRemoveIndex = queue.findIndex(
              p => p.id === candidateInqueue.id
            );
            queue.splice(queueToRemoveIndex, 1);
            nextpromise({ uuidv4, batchName, promiseName, id: nextId });
            updateConsoleTable(promiseStates);
            console.log('--2---freeBatchSpaces222222', freeBatchSpaces);
          } else {
            console.log('--2--- empty');
          }
        }
      } else {
        const avaiablePromises = Object.entries(
          reduceQueue(queue)
        ).filter(f => {
          const bName = f[0];
          if (bName !== batchName) {
            return f;
          }
        });
        const nextpromise = avaiablePromises[0][1][0];
        const { uuidv4, promiseName, id: nextId } = nextpromise;
        promises.push(nextpromise);
        const queueToRemoveIndex = queue.findIndex(
          p => p.id === nextpromise.id
        );
        queue.splice(queueToRemoveIndex, 1);
        nextpromise({ uuidv4, batchName, promiseName, id: nextId });
        updateConsoleTable(promiseStates);
        console.log('---3---');
      }
    } else {
      const avaiablePromises = Object.entries(reduceQueue(queue)).filter(f => {
        const bName = f[0];
        //const proms = f[1];
        const inprocess = promises.filter(f => f.batchName === bName);

        if (bName !== batchName && inprocess.length < batchConcur) {
          return f;
        }
      });
      if (avaiablePromises && avaiablePromises.length > 0) {
        const nextpromise = avaiablePromises[0][1][0];
        const { uuidv4, promiseName, id: nextId } = nextpromise;
        promises.push(nextpromise);
        const queueToRemoveIndex = queue.findIndex(
          p => p.id === nextpromise.id
        );
        queue.splice(queueToRemoveIndex, 1);
        nextpromise({ uuidv4, batchName, promiseName, id: nextId });
        updateConsoleTable(promiseStates);
        console.log('---4---');
      } else {
        updateConsoleTable(promiseStates);
        console.log('--4---empty', queue.length, promises.length);
        //promiseExecCompleted();
      }
    }
  } catch (error) {}
}
module.exports = {
  promiseConcurrency,
  eventEmitter,
  updateConsoleTable,
  reduceQueue
};
