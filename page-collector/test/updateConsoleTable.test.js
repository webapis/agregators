const { updateConsoleTable } = require('../promiseConcurrency');

describe('updateConsoleTable test', () => {
  it.only('updateConsoleTable test', function() {
    this.timeout(200000);
    const promisesInQueue = [
      { batchName: 'defacto', uuid: 1 },
      { batchName: 'defacto', uuid: 2 },
      { batchName: 'koton', uuid: 4 }
    ];
    const promisesInprocess = [
      { batchName: 'defacto', uuid: 4 },
      { batchName: 'defacto', uuid: 5 },
      { batchName: 'koton', uuid: 7 },
      { batchName: 'koton', uuid: 9 }
    ];
    updateConsoleTable([
      { state: 'queque', promises: promisesInQueue },
      { state: 'proccess', promises: promisesInprocess }
    ]);
  });
});
