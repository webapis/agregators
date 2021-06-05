/* eslint-disable no-undef */
const { promiseConcurrency } = require('../promiseConcurrency');

const assert = require('assert');
const { uuidv4 } = require('../uuidv4');

describe('test promiseConcurrencyManager', function() {
  it('invokeNextPromise', function(done) {
    this.timeout(30000);
    const eventEmitter = promiseConcurrency({
      batchConcurrency: 5,
      totalConcurrency: 20
    });
    eventEmitter.once('promiseStateChanged', state => {
      const { promises, queue } = state;
      assert.equal(promises.length, 20);
      assert.equal(queue.length, 66);
      clearInterval(eventEmitter.setTimeInterVal);
      done();
    });
    let i = 0;
    let promises = [];
    let queue = [];

    for (i; i < 10; i++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'defacto';
      promises.push(promise);
    }

    let b = 0;
    for (b; b < 25; b++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'defacto';
      queue.push(promise);
    }
    let c = 0;
    for (c; c < 25; c++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'koton';
      queue.push(promise);
    }

    let d = 0;
    for (d; d < 26; d++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'levis';
      queue.push(promise);
    }
    eventEmitter.emit('setInitialState', { promises, queue });
  });
  it('promiseResolved', function(done) {
    this.timeout(30000);
    const eventEmitter = promiseConcurrency({
      batchConcurrency: 5,
      totalConcurrency: 20
    });
    const resolvedPromise = function() {};
    resolvedPromise.id = uuidv4();
    resolvedPromise.batchName = 'defacto';
    eventEmitter.once('promiseStateChanged', state => {
      const { promises, resolved } = state;

      assert.equal(promises.length, 5);
      assert.equal(resolved.length, 1);
      clearInterval(eventEmitter.setTimeInterVal);
      done();
    });
    let i = 0;
    let promises = [];
    for (i; i < 5; i++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'defacto';
      promises.push(promise);
    }
    promises.push(resolvedPromise);
    eventEmitter.emit('setInitialState', { promises });
    eventEmitter.emit('promiseResolved', resolvedPromise);
  });
  it('promiseRejected', function(done) {
    this.timeout(30000);
    const eventEmitter = promiseConcurrency({
      batchConcurrency: 5,
      totalConcurrency: 20
    });
    const rejectedPromise = function() {};
    rejectedPromise.id = uuidv4();
    rejectedPromise.batchName = 'defacto';
    rejectedPromise.error = { message: 'Somethng went wrong' };
    eventEmitter.once('promiseStateChanged', state => {
      const { promises, rejected } = state;

      assert.equal(promises.length, 5);
      assert.equal(rejected.length, 1);
      clearInterval(eventEmitter.setTimeInterVal);
      done();
    });
    let i = 0;
    let promises = [];
    for (i; i < 5; i++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'defacto';
      promises.push(promise);
    }
    promises.push(rejectedPromise);
    eventEmitter.emit('setInitialState', { promises });
    eventEmitter.emit('promiseRejected', rejectedPromise);
  });

  it('promiseExecComplete', function(done) {
    this.timeout(30000);
    const eventEmitter = promiseConcurrency({
      batchConcurrency: 5,
      totalConcurrency: 20
    });

    eventEmitter.once('promiseExecComplete', state => {
      assert.equal(state, true);

      done();
    });
    let i = 0;
    let resolved = [];
    let total = [];
    for (i; i < 5; i++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'defacto';
      resolved.push(promise);
      total.push(promise);
    }
    let b = 0;
    let rejected = [];
    for (b; b < 5; b++) {
      const promise = function() {};
      promise.id = uuidv4();
      promise.batchName = 'defacto';
      rejected.push(promise);
      total.push(promise);
    }

    eventEmitter.emit('setInitialState', { rejected, resolved, total });
  });
});
