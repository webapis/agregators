/* eslint-disable no-undef */
const { promiseConcurrency, eventEmitter } = require('../promiseConcurrency');
const sinon = require('sinon');
const assert = require('assert');

describe('promiseConcurrencyManager test', function() {
  beforeEach(function() {});
  afterEach(function() {
    // Restore all the things made through the sandbox
  });
  describe('test promise attached eventEmitter', function() {
    it('1.promises array is empty', function(done) {
      debugger;
      const eventEmitter = promiseConcurrency({
        batchConcurrency: 4,
        totalConcurrency: 10
      });
      const promise = function() {};
      promise.id = '01';
      eventEmitter.on('promiseAttachmentHandled', state => {
        const { promises } = state;
        debugger;
        assert.equal(promises.length, 1);

        done();
      });

      eventEmitter.emit('promiseAttached', promise);
    });

    describe('2.promises array is not empty', function() {
      it('2.1 total promises length limit is reached', function(done) {
        debugger;
        const eventEmitter = promiseConcurrency({
          batchConcurrency: 4,
          totalConcurrency: 10
        });
        const nextPromise = function() {};
        nextPromise.id = '2.1';
        nextPromise.batchName = 'defacto';
        let i = 0;
        let promises = [];
        for (i; i < 10; i++) {
          const promise = function() {};
          promise.id = i;
          promise.batchName = 'defacto';
          promises.push(promise);
        }
        eventEmitter.on('promiseAttachmentHandled', state => {
          const { promises, queue } = state;
          debugger;
          assert.equal(promises.length, 10);
          assert.equal(queue.length, 1);
          done();
        });
        eventEmitter.emit('setInitialState', { promises });
        eventEmitter.emit('promiseAttached', nextPromise);
      });
      describe('2.2 total promises length limit is not reached', function() {
        it('2.2.1 batch limit is reached', function(done) {
          debugger;
          const eventEmitter = promiseConcurrency({
            batchConcurrency: 4,
            totalConcurrency: 10
          });
          const nextPromise = function() {};
          nextPromise.id = 12;
          nextPromise.batchName = 'defacto';
          let i = 0;
          let promises = [];
          for (i; i < 4; i++) {
            const promise = function() {};
            promise.id = i;
            promise.batchName = 'defacto';
            promises.push(promise);
          }
          eventEmitter.on('promiseAttachmentHandled', state => {
            const { promises, queue } = state;

            assert.equal(promises.length, 4);
            assert.equal(queue.length, 1);
            done();
          });
          eventEmitter.emit('setInitialState', { promises });
          eventEmitter.emit('promiseAttached', nextPromise);
        });
        it('2.2.2 batch limit is not reached', function(done) {
          debugger;
          const eventEmitter = promiseConcurrency({
            batchConcurrency: 4,
            totalConcurrency: 10
          });
          const nextPromise = () => {};
          nextPromise.id = 13;
          nextPromise.batchName = 'defacto';
          let i = 0;
          let promises = [];
          for (i; i < 3; i++) {
            const promise = function() {};
            promise.id = i;
            promise.batchName = 'defacto';
            promises.push(promise);
          }
          eventEmitter.on('promiseAttachmentHandled', state => {
            const { promises, queue } = state;
            debugger;
            assert.equal(promises.length, 4);
            assert.equal(queue.length, 0);
            done();
          });
          eventEmitter.emit('setInitialState', { promises });
          eventEmitter.emit('promiseAttached', nextPromise);
        });
      });
    });
  });
});
