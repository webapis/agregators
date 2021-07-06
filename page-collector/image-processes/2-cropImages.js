const Jimp = require('jimp');
const makeDir = require('make-dir');
const path = require('path');
const fs =require('fs')
const { parentPort, workerData } = require('worker_threads');
const { nextSlice, imageWidth, index,skipProcessed } = workerData;

async function cropImage() {
  let processed = nextSlice.length;

  for (let p of nextSlice) {

    try {
      const output = p
        .replace(`page-image/${process.env.projectName}`, `page-image-resized/${process.env.projectName}/${imageWidth}`)
        if(skipProcessed && fs.existsSync(output) ){
       
          continue;
        }
  
      await makeDir(path.dirname(output));
      const image = await Jimp.read(p);
      const imageBugger = await image.getBufferAsync(Jimp.AUTO);
   //   if (imageBugger) {
  
        await image.resize(imageWidth, Jimp.AUTO);
        await image.quality(60);
        await image.writeAsync(output);
        processed ++;
        // console.log(
        //   `image inside worder ${index} processed, processed: ${processed} ${index}`
        // );
    
       //puEventEmitter.emit('')
     // } else{
        //console.log('image not found')
    //  }
   
    } catch (error) {
      
      console.log('cropImage error from file||||||||', p);
      console.log('Error is ', error);
    }
  }

  parentPort.postMessage(`Images are processed`);
  
}

cropImage();
