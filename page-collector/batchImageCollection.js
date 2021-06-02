const fs = require('fs');
const request = require('request');
const { walkSync } = require('./walkSync');
const path = require('path');
const makeDir = require('make-dir');
const { uuidv4 } = require('./uuidv4');
const { promiseConcurrency, eventEmitter } = require('./promiseConcurrency');

const ws_domain = 'tr/moda';
function download(url, dest, result) {
  const { batchName, uuidv4 } = result;
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);
  return () => {
    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    return new Promise((resolve, reject) => {
      request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: url,
        gzip: true
      })
        .pipe(file)
        .on('finish', async () => {
          console.log(`The file is finished downloading.`);
          resolve();
          eventEmitter.emit('promiseResolved', { batchName, uuidv4 });
        })
        .on('error', error => {
          reject(error);
        });
    });
  };
}
function batchImageCollection() {
  promiseConcurrency({
    batchConcurrency: 2,
    totalConcurrency: 10
  });
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

          promise.uuidv4 = uuidv4();
          promise.batchName = batchName;
          eventEmitter.emit('promiseAttached', promise);
        }
      }
    } catch (error) {}
  });
}

module.exports = {
  batchImageCollection
};
