const { workerService } = require('./workerService');
const { walkSync } = require('./walkSync');
const fs = require('fs')
const ws_domain = 'tr/moda';
async function batchImageProcessing({
  taskSequelizerEventEmitter,
  imageWidth,
  script,
  folderName,
  batch = 100,
  processType,
  skipProcessed
}) {
  let queque = [];
  console.log('start....');
  walkSync(`${process.cwd()}/${folderName}/${ws_domain}`, async function (
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
      if (!skipProcessed) {
        queque.push(filepath);
      }
      else
        if (skipProcessed && !fs.existsSync(filepath)) {

          queque.push(filepath);
        }

    }
  });
  let i;

  let promises = [];
  debugger;
  for (i = 0; i <= queque.length; i += batch) {
    const nextSlice = queque.slice(i, i + batch);
    promises.push(
      workerService({
        workerData: { nextSlice, index: i, imageWidth },
        script
      })
    );
  }
  await Promise.all(promises);
  console.log('queque', queque.length);
  taskSequelizerEventEmitter.emit('taskComplete', `page_image_${processType}`)

  console.log('end....');
}

module.exports = {
  batchImageProcessing
};
