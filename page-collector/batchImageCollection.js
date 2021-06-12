const fs = require('fs');
const request = require('request');
const { walkSync } = require('./walkSync');
const path = require('path');
const makeDir = require('make-dir');
const fetch = require('node-fetch');
const { uuidv4 } = require('./uuidv4');
const { promiseConcurrency } = require('./promiseConcurrency');
let eventEmitter = promiseConcurrency({
  batchConcurrency: 10,
  totalConcurrency: 20
});
const ws_domain = 'tr/moda';
function download(url, dest) {
  // const file = fs.createWriteStream(dest);

  return async function({ batchName, id }) {
    try {
      if (fs.existsSync(dest)) {
        debugger;
        eventEmitter.emit('promiseResolved', { id, batchName });
      } else {
        
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFile(dest, buffer, () => {
          eventEmitter.emit('promiseResolved', { id, batchName });
        });
      }
    } catch (error) {
      eventEmitter.emit('promiseRejected', { id, batchName, error });
    }
  };

  /* Create an empty file where we can save data */
}
async function batchImageCollection() {

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
    } catch (error) {}
  });
}

module.exports = {
  batchImageCollection
};
