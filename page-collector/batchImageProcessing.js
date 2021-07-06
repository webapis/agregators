const { workerService } = require('./workerService');
const { walkSync } = require('./walkSync');
const {cpuTaskController}=require('./cpuTaskController')
const fs = require('fs')
const ws_domain = 'tr/moda';
async function batchImageProcessing({
  taskSequelizerEventEmitter,
  imageWidth,
  script,
  folderName,
  batch = 10,
  processType,
  skipProcessed
}) {
  const cpuEventEmitter = cpuTaskController({batch,totalConcurrency:1})
  let queque = [];

  
  walkSync(`${process.cwd()}/${folderName}/${process.env.projectName}`, async function (
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
          queque.push(filepath);
    }
  });
  let i;

  for (i = 0; i <= queque.length; i += batch) {
    
    const nextSlice = queque.slice(i, i + batch);
  //console.log('nextSlice',nextSlice.length)
    cpuEventEmitter.emit('taskAttached',{ workerData:{nextSlice, index: i, imageWidth, skipProcessed, batchName:process.env.projectName},script,eventEmitter:cpuEventEmitter,processType })
    // promises.push(
    //   workerService({
    //     workerData: { nextSlice, index: i, imageWidth, skipProcessed,eventEmitter:cpuEventEmitter },
    //     script
    //   })
    // );
    
  }
  cpuEventEmitter.emit('all_tasks_attached',queque.length)
  cpuEventEmitter.on('all_tasks_complete',()=>{
     taskSequelizerEventEmitter.emit('taskComplete', `page_image_${processType}`)
  })



}

module.exports = {
  batchImageProcessing
};
