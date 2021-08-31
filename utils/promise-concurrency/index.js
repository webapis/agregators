
const EventEmitter = require('events');
const { uuidv4 } = require('../uuidv4');
const { stateTableLog } = require('./state-table-log')
const { fb_steps } = require('../../utils/firebase/firebaseEventEmitter')
//const { fbDatabase } = require('../../utils/firebase/firebaseInit')
const { fbRest } = require('../firebase/firebase-rest')

const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)

const startedDateTime = global.fb_run_id
const rootFirebaseRef = `runs/${global.fb_uid}/${process.env.projectName}/${startedDateTime}`
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

    this.promiseStateMonitor = setInterval(() => {

      this.calculatePromiseState()
    }, 10000)
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

    this.on('invokeNextPromise', async () => {
      if (this.sync === false) {
        await this.invokeNextPromise()
      }



    })

    this.on('promiseAttached', function ({ promise, unshift }) {

      const promiseWithId = promise;
      promiseWithId.id = uuidv4();
      promiseWithId.retries = 0;

      if (unshift) {
        this.queue.unshift(promiseWithId);
      } else {
        this.queue.push(promiseWithId);
      }
      this.total.push(promiseWithId);

      stateTableLog({ self: this, promise })

      this.emit('invokeNextPromise')
    });

    this.on('promiseResolved', function (promise) {

      const { id } = promise
      this.resolved.push(promise);
      this.sync = false
      const promiseToRemoveIndex = this.promises.findIndex(p => p.id === id);
      this.promises.splice(promiseToRemoveIndex, 1);
      stateTableLog({ self: this, promise })
      this.emit('invokeNextPromise')

    });

    this.on('retryPromise', function (ret) {
      const { promise, unshift } = ret

      this.sync = false
      if (promise.retries === this.rejectedRetry) {
        let taskName = ''
        switch (this.taskName) {
          case 'dataCollection':
            taskName = 'RETRIEVING_PAGES_FAILED';
            break;
          case 'imageCollection':
            taskName = 'COLLECTING_IMAGES_FAILED';
            break;
          default:
            taskName = 'COLLECTING_RESOURCES_FAILED';
        }
   ;
        this.rejected.push(promise);
   ;
        global.fb_eventEmitter.emit(fb_steps.RETRIE_PROMISE_FAILED, { batchName: promise.batchName, taskName })

      } else {
        const promiseToRetry = promise
        promiseToRetry.retries = promise.retries > 0 ? ++promise.retries : 1
        if (unshift) {
          this.queue.unshift(promiseToRetry);
        } else {
          this.queue.push(promiseToRetry);
        }

      }
      const promiseToRemoveIndex = this.promises.findIndex(
        p => p.id === promise.id
      );

      this.promises.splice(promiseToRemoveIndex, 1);

      stateTableLog({ self: this, promise })


      this.emit('invokeNextPromise')
    })

  }//constructor

  calculatePromiseState(cb) {

    const batchNames = this.total.map((m) => m.batchName)
    let promiseStates = []
    batchNames.forEach(batchName => {
      const total = this.total.filter(t => t.batchName === batchName).length;
      const inQueue = this.queue.filter(t => t.batchName === batchName).length;
      const inProccess = this.promises.filter(t => t.batchName === batchName && t.retries === 0).length;
      const retries = this.promises.filter(t => t.batchName === batchName && t.retries > 0).length;
      const resolved = this.resolved.filter(t => t.batchName === batchName).length;
      const rejected = this.rejected.filter(t => t.batchName === batchName).length
      promiseStates.push({ total, inQueue, inProccess, retries, resolved, rejected, batchName })
    })
    const promiseState = convertArrayToObject(promiseStates, 'batchName')
    let taskName = ''
    switch (this.taskName) {
      case 'dataCollection':
        taskName = 'RETRIEVING_PAGES';
        break;
      case 'imageCollection':
        taskName = 'COLLECTING_IMAGES';
        break;
      default:
        taskName = 'COLLECTING_RESOURCES';
    }
    const dbRef = fbDatabase.ref(`${rootFirebaseRef}/${taskName}`)
    dbRef.update(promiseState, (error) => {
      if (error) {
        console.log(error)
      } else {
        if (cb) {

          cb()
        }

      }
    })
  }
  async invokeNextPromise() {


    if (this.queue.length === 0 && this.promises.length === 0) {
  
      clearInterval(this.promiseStateMonitor)

      this.calculatePromiseState(
        () => {
     
          this.emit('promiseExecComplete')
        }
      )

    } else if (this.queue.length > 0) {

      for (let i = 0; i < this.queue.length; i++) {
        const { batchName } = this.queue[i]

        const batchCounter = this.promises.length === 0 ? 0 : this.promises.filter(f => f.batchName === batchName).length;
        const freeBatchSpaces = this.batchConcur - batchCounter;

        if (freeBatchSpaces > 0 && this.sync === false) {

          const nextpromise = this.queue[i];
          const { batchName, id, retries } = nextpromise;
          this.sync = nextpromise.sync

          this.promises.push(nextpromise);

          const queueToRemoveIndex = this.queue.findIndex(
            p => p.id === nextpromise.id
          );
          this.queue.splice(queueToRemoveIndex, 1);
          stateTableLog({ self: this, promise: nextpromise })
          await nextpromise({ batchName, id, retries });

        } else {


          continue;
        }
      }
    }

  }
}
function convertArrayToObject(array, key) {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
}
function promiseConcurrency({ batchConcurrency, rejectedRetry = 3, taskName }) {

  const promiseEmitter = new PromiseEmitter(batchConcurrency, rejectedRetry, taskName);
  promiseEmitter.setMaxListeners(50);
  global.pc_eventEmitter = promiseEmitter
  return promiseEmitter;
}

module.exports = { promiseConcurrency }