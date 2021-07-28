
const EventEmitter = require('events');
const { uuidv4 } = require('../uuidv4');
const { stateTableLog } = require('./state-table-log')

class PromiseEmitter extends EventEmitter {
  constructor(batchConcur, rejectedRetry, taskName) {
    super();
    this.batchConcur = batchConcur;
    this.queue = [];
    this.promises = [];
    this.rejected = [];
    this.resolved = [];
    this.total = [];
    this.rejectedRetry = rejectedRetry
    this.taskName = taskName
    this.retries = []
    this.sync = false
    this.on('initState', (state) => {
      const { queue, promises, resolved, rejected, retries, total } = state
      queue && this.queue.push(...queue)
      promises && this.promises.push(...promises)
      resolved && this.resolved.push(...resolved)
      rejected && this.rejected.push(...rejected)
      retries && this.retries.push(...retries)
      total && this.total.push(...total)
      this.emit('initStateSet')
    })

    this.on('invokeNextPromise', () => {
      if (this.sync === false) {
        debugger;
        this.invokeNextPromise()
     
      }



    })
    this.on('log_state', ({ self, promise }) => {

      stateTableLog({ self, promise })

    })
    this.on('promiseAttached', function ({ promise, unshift }) {
      try {
        const promiseWithId = promise;
        promiseWithId.id = uuidv4();
        promiseWithId.retries = 0;

        if (unshift) {
          this.queue.unshift(promiseWithId);
        } else {
          this.queue.push(promiseWithId);
        }
        this.total.push(promiseWithId);



        this.emit('log_state', { self: this, promise })

      } catch (error) {
        debugger;
        throw error
      }
    });

    this.on('promiseResolved', function (promise) {

      const { id } = promise
      this.resolved.push(promise);
      this.sync = false
      debugger;
      const promiseToRemoveIndex = this.promises.findIndex(p => p.id === id);
      this.promises.splice(promiseToRemoveIndex, 1);

      this.emit('log_state', { self: this, promise })
    });

    this.on('retryPromise', function (ret) {
      const { promise } = ret
      debugger;
      if (promise.retries === this.rejectedRetry) {
        debugger;
        this.rejected.push(promise);
        this.sync = false
        debugger;
        this.emit('log_state', { self: this, promise })

      } else {

        debugger;
        const promiseToRetry = promise
        promiseToRetry.retries = promise.retries > 0 ? ++promise.retries : 1
        this.queue.push(promiseToRetry);

      }
      const promiseToRemoveIndex = this.promises.findIndex(
        p => p.id === promise.id
      );

      this.promises.splice(promiseToRemoveIndex, 1);


      this.emit('log_state', { self: this, promise })
    })


  }
  invokeNextPromise() {

    for (let i = 0; i < this.queue.length; i++) {
      const { batchName } = this.queue[i]

      const batchCounter = this.promises.length === 0 ? 0 : this.promises.filter(f => f.batchName === batchName).length;
      const freeBatchSpaces = this.batchConcur - batchCounter;

      if (freeBatchSpaces > 0 && this.sync === false) {
debugger;
        const nextpromise = this.queue[i];
        const { batchName, id, retries } = nextpromise;
        this.sync = nextpromise.sync
        debugger;
        this.promises.push(nextpromise);
        const queueToRemoveIndex = this.queue.findIndex(
          p => p.id === nextpromise.id
        );
        this.queue.splice(queueToRemoveIndex, 1);

        nextpromise({ batchName, id, retries });

      } else {
        continue;
      }
    }
    if (this.queue.length === 0 && this.promises.length === 0) {
      this.emit('promiseExecComplete')
    }

  }

}

function promiseConcurrency({ batchConcurrency, rejectedRetry = 3, taskName }) {

  const promiseEmitter = new PromiseEmitter(batchConcurrency, rejectedRetry, taskName);
  promiseEmitter.setMaxListeners(50);
  global.pc_eventEmitter = promiseEmitter
  return promiseEmitter;
}

module.exports = { promiseConcurrency }