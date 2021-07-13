/* eslint-disable no-undef */
const { promiseConcurrency } = require('../promiseConcurrency');

const assert = require('assert');
const { uuidv4 } = require('../uuidv4');

describe('test promiseConcurrencyManager', function() {
  it('invokeNextPromise', function(done) {
    debugger;
    this.timeout(30000);
    const eventEmitter = promiseConcurrency({
      batchConcurrency: 5,
      totalConcurrency: 20
    });

  });
});
