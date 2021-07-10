const fs = require('fs');
const { printTable } = require('console-table-printer');
const { uuidv4 } = require('./uuidv4');
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

    this.on('promiseAttached', function ({ promise, unshift }) {
  
      const promiseWithId = promise;
      promiseWithId.id = uuidv4();
      if (unshift) {
        this.queue.unshift(promiseWithId);
      } else {
        this.queue.push(promiseWithId);
      }
      this.total.push(promiseWithId);
    });
    this.on('setInitialState', initialState => {
      this.promises =
        initialState.promises !== undefined ? initialState.promises : [];

      this.queue = initialState.queue !== undefined ? initialState.queue : [];
      this.resolved =
        initialState.resolved !== undefined ? initialState.resolved : [];
      this.rejected =
        initialState.rejected !== undefined ? initialState.rejected : [];
      this.total = initialState.total !== undefined ? initialState.total : [];
    });

    this.on('promiseResolved', function (promise) {
      
      const { id } = promise;

      this.resolved.push(promise);
      const promiseToRemoveIndex = this.promises.findIndex(p => p.id === id);
      //this.promises.shift();
      this.promises.splice(promiseToRemoveIndex, 1);
      this.promiseStateChanged();
    });
    this.on('promiseRejected', function (promise) {
      
      const { id } = promise;
      this.rejected.push(promise);
    const promiseToRemoveIndex = this.promises.findIndex(p => p.id === id);
      this.promises.splice(promiseToRemoveIndex, 1);

      this.promiseStateChanged();
    });

    this.on('invokeNextPromise', function () {
      this.invokeNextPromise();
    });
    this.setTimeInterVal = setInterval(() => {
      const totalResult = this.rejected.length + this.resolved.length;
      let promiseStates = [
        { state: 'total', promises: this.total ? this.total : [] },
        { state: 'queque', promises: this.queue ? this.queue : [] },
        { state: 'proccess', promises: this.promises ? this.promises : [] },
        { state: 'resolved', promises: this.resolved ? this.resolved : [] },
        { state: 'rejected', promises: this.rejected ? this.rejected : [] }
      ];
      if (this.queue.length > 0) {
        
        this.emit('invokeNextPromise');

        updateConsoleTable(promiseStates);
      }
      if (this.queue.length === 0 && this.promises.length > 0) {
        updateConsoleTable(promiseStates);
      }
      if (
        this.queue.length === 0 &&
        this.total.length === totalResult &&
        totalResult > 0 &&
        this.promises.length === 0
      ) {
        this.emit('promiseExecComplete', true);
        clearInterval(this.setTimeInterVal);
        updateConsoleTable(promiseStates);
      }
    }, 2000);
  }
  invokeNextPromise() {
    //1.queue is empty
    if (this.queue.length === 0) {
      this.promiseStateChanged();
      return;
    }
    //2.queue is not empty
    //2.1 total promise length limit is reached
    if (this.promises.length === this.totalConcur) {
      this.promiseStateChanged();
      return;
    }
    //2.2 total promises length limit is not reached
    //2.2.1 find promise batchNames with free limit
    const avaiablePromises = Object.entries(reduceQueue(this.queue));

    if (avaiablePromises.length > 0) {
      let i = 0;
      for (i; i < avaiablePromises.length; i++) {
        const batch = avaiablePromises[i];
        const batchName = batch[0];
        const promisesInQueue = batch[1];
        const batchCounter = this.promises.filter(
          f => f.batchName === batchName
        );
        const freeBatchSpaces = this.batchConcur - batchCounter.length;
        if (this.promises.length <= this.totalConcur) {
          var b;
          for (b = 0; b < promisesInQueue.length && b < freeBatchSpaces; b++) {
            const nextpromise = promisesInQueue[b];
            const { uuidv4, batchName, promiseName, id } = nextpromise;
            this.promises.push(nextpromise);
            nextpromise({ uuidv4, batchName, promiseName, id });
            const queueToRemoveIndex = this.queue.findIndex(
              p => p.id === nextpromise.id
            );
            this.queue.splice(queueToRemoveIndex, 1);
          }
        }
      }
      this.promiseStateChanged();
    }
  }
  promiseStateChanged() {
    this.emit('promiseStateChanged', {
      queue: this.queue,
      promises: this.promises,
      rejected: this.rejected,
      total: this.total,
      resolved: this.resolved
    });
  }
}

function promiseConcurrency({ batchConcurrency, totalConcurrency }) {
  const promiseEmitter = new PromiseEmitter(batchConcurrency, totalConcurrency);
  promiseEmitter.setMaxListeners(50);
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

  const addPercentage = rows.map(r => {
    const { queque, proccess } = r;

    const total = queque + proccess;
    const left = queque * 100 / total;
    const progress = total ? Math.ceil(100 - left) : '';

    return { ...r, progress };
  });

 // console.clear();
  printTable(addPercentage);

  // promiseExecCompleted();
}

function reduceQueue(promisesInQueue) {
  const result = groupBy(promisesInQueue, 'batchName');

  return result;
}

function groupBy(arr, property) {
  return arr.reduce(function (memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

module.exports = {
  promiseConcurrency,
  updateConsoleTable,
  reduceQueue
};
