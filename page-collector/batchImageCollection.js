const fs = require('fs');
const { walkSync } = require('./walkSync');
const path = require('path');
const makeDir = require('make-dir');
const fetch = require('node-fetch');
const { promiseConcurrency } = require('../utils/promise-concurrency');
let eventEmitter = promiseConcurrency({
  batchConcurrency:6, rejectedRetry:3, taskName:'imageCollection'
});

function download(url, dest) {


  return async function({ batchName, id }) {
    
    try {
      if (fs.existsSync(dest)) {
   
        eventEmitter.emit('promiseResolved', { id, batchName });
      } else {
        
        const response = await fetch(url,{timeout:50000});
        const buffer = await response.buffer();
        fs.writeFile(dest, buffer, () => {
          eventEmitter.emit('promiseResolved', { id, batchName });
        });
      }
    } catch (error) {
        const retry =download
         retry.id=id
         retry.batchName=batchName
         retry.error= error
      eventEmitter.emit('promiseRejected', retry);
    }
  };

  /* Create an empty file where we can save data */
}
async function batchImageCollection({taskSequelizerEventEmitter}) {

  eventEmitter.on('promiseExecComplete', async () => {

    taskSequelizerEventEmitter.emit('taskComplete', 'page_image_collection')
    
  })
let files =[]

  walkSync(`${process.cwd()}/page-data/${process.env.projectName}`, async filepath => {
      files.push(filepath)
  });
debugger;
  for (let filepath of files){
    
    const batchName = path.basename(filepath, '.json');

    const data = fs.readFileSync(filepath, { encoding: 'utf-8' });
     const output =`${process.cwd()}/page-image/${process.env.projectName}`
   

    await makeDir(output);
    const dataObject = JSON.parse(data);
    for (let d of dataObject) {
 debugger;
      const { images } = d;
      debugger;
      images.forEach(image=>{
        const filename = path.basename(image);
        const fileEndPath = `${output}/${filename}`;
        const promise = download(image, fileEndPath, {
          batchName
        });

        promise.batchName = batchName;
        eventEmitter.emit('promiseAttached', {promise,unshift:false});
      })
      
    }

  }
  

}

module.exports = {
  batchImageCollection
};