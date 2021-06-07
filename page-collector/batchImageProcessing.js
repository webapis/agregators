const { workerService } = require('./workerService');
const { walkSync } = require('./walkSync');
const ws_domain = 'tr/moda';
async function batchImageProcessing({
  imageWidth,
  script,
  folderName,
  batch = 100
}) {
  let queque = [];
  console.log('start....');
  walkSync(`${process.cwd()}/${folderName}/${ws_domain}`, async function(
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
      queque.push(filepath);
    }
  });
  let i;

  let promises = [];
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

  console.log('end....');
}

module.exports = {
  batchImageProcessing
};
