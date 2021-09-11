const Jimp = require('jimp');
const makeDir = require('make-dir');
const path = require('path');
const fs =require('fs')
const { parentPort, workerData } = require('worker_threads');
const { nextSlice, imageWidth, index,skipProcessed } = workerData;

async function blurImage() {
  let remained = nextSlice.length;
  for (let p of nextSlice) {
    try {
      const filename =path.basename(p)
      const output = `${process.cwd()}/page-image-blurred/${process.env.projectName}/${imageWidth}/${filename}`
 
      if(skipProcessed && fs.existsSync(output) ){
        continue;
      }
      
      await makeDir(path.dirname(output));
      const image = await Jimp.read(p);
      await image.resize(imageWidth, Jimp.AUTO);
      await image.quality(20);
      await image.blur(5);
      await image.writeAsync(output);
      remained--;
    } catch (error) {
      
      console.log('image path', p);
      console.log('image embedding error', error);
    }
  }
  parentPort.postMessage(`Images are processed`);

}

blurImage();
