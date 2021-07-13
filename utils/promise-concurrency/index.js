
const EventEmitter = require('events');
const { uuidv4 } = require('../uuidv4');
const { stateTableLog } = require('./state-table-log')

class PromiseEmitter extends EventEmitter {
  constructor(batchConcur, rejectedRetry) {
    super();
    this.batchConcur = batchConcur;
    this.queue = [];
    this.promises = [];
    this.rejected = [];
    this.resolved = [];
    this.total = [];
    this.rejectedRetry = rejectedRetry
    this.retries = []

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

    this.on('invokeNextPromise',()=>{
      this.invokeNextPromise()
    })
    this.on('log_state',({self,promise})=>{
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

   
   
      this.emit('log_state',{ self: this, promise })

      } catch (error) {
        debugger;
        throw error
      }
    });

    this.on('promiseResolved', function (promise) {
      debugger
      const { id } = promise
      this.resolved.push(promise);
      const promiseToRemoveIndex = this.promises.findIndex(p => p.id === id);
      this.promises.splice(promiseToRemoveIndex, 1);
      debugger;
      this.emit('log_state',{ self: this, promise })
    });
    this.on('promiseRejected', function (promise) {
debugger;
      if (promise.retries === this.rejectedRetry) {
        debugger;
        this.rejected.push(promise);
      } else {

        const promiseToRetry = promise
        promiseToRetry.retries= promise.retries > 0 ? ++promise.retries : 1
        this.queue.push(promiseToRetry);

      }
      const promiseToRemoveIndex = this.promises.findIndex(
        p => p.id === promise.id
      );

      this.promises.splice(promiseToRemoveIndex, 1);
debugger;

   this.emit('log_state',{ self: this, promise })

      
    });


  }
   invokeNextPromise() {
    debugger;
    try {


      for (let i = 0; i < this.queue.length; i++) {
        const { batchName } = this.queue[i]

        const batchCounter = this.promises.length === 0 ? 0 : this.promises.filter(f => f.batchName === batchName).length;
        const freeBatchSpaces = this.batchConcur - batchCounter;

        if (freeBatchSpaces > 0) {

          const nextpromise = this.queue[i];
          const { batchName, id } = nextpromise;

          this.promises.push(nextpromise);
          const queueToRemoveIndex = this.queue.findIndex(
            p => p.id === nextpromise.id
          );
          this.queue.splice(queueToRemoveIndex, 1);

          nextpromise({ batchName, id });
      
          debugger;
        } else {
          continue;
        }

      }
      if (this.queue.length === 0 && this.promises.length === 0) {
        debugger;
        this.emit('promiseExecComplete')
      }
      
    } catch (error) {
      debugger;
    }
  }

}

function promiseConcurrency({ batchConcurrency, rejectedRetry = 3 }) {
  debugger;
  const promiseEmitter = new PromiseEmitter(batchConcurrency, rejectedRetry);
  promiseEmitter.setMaxListeners(50);

  return promiseEmitter;
}

module.exports = { promiseConcurrency }