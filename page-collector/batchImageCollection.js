const fs = require('fs');
const request = require('request');
const { walkSync } = require('./walkSync');
const path = require('path');
const makeDir = require('make-dir');
const { uuidv4 } = require('./uuidv4');
const { promiseConcurrency } = require('./promiseConcurrency');
let eventEmitter = promiseConcurrency({
  batchConcurrency: 5,
  totalConcurrency: 10
});
const ws_domain = 'tr/moda';
function download(url, dest) {
  const file = fs.createWriteStream(dest);

  return function({ batchName, id }) {
    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    // return new Promise((resolve, reject) => {
    try {
      request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: url,
        gzip: true
      })
        .pipe(file)
        .on('finish', async () => {
          console.log(`The file is finished downloading.`);
          eventEmitter.emit('promiseResolved', { id, batchName });
          // resolve();
        })
        .on('error', error => {
          console.error('____', error);
          eventEmitter.emit('promiseRejected', { id, batchName, error });
          //reject(error);
        });
    } catch (error) {
      debugger;
    }

    // })
  };

  /* Create an empty file where we can save data */
}
function batchImageCollection() {
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  })
  walkSync(`${process.cwd()}/page-data/${ws_domain}`, async filepath => {
    try {
      const batchName = path.basename(filepath, '.json');

      const data = fs.readFileSync(filepath, { encoding: 'utf-8' });
      const output =
        path.dirname(
          `${process.cwd()}/page-image/${filepath.substring(
            filepath.indexOf(ws_domain)
          )}`
        ) + '/img/original';

      await makeDir(output);
      const dataObject = JSON.parse(data);
      for (let d of dataObject) {
        const { image: { optsrc } } = d;
        if (optsrc) {
          const filename = path.basename(optsrc);
          const fileEndPath = `${output}/${filename}`;
          const promise = download(optsrc, fileEndPath, {
            batchName
          });

          promise.batchName = batchName;
          eventEmitter.emit('promiseAttached', promise);
        }
      }
    } catch (error) {
      debugger;
    }
  });
}

module.exports = {
  batchImageCollection
};
