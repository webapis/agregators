const Jimp = require('jimp');
const makeDir = require('make-dir');
const path = require('path');
const { parentPort, workerData } = require('worker_threads');
const { nextSlice, imageWidth, index } = workerData;

async function blurImage() {
  let remained = nextSlice.length;
  for (let p of nextSlice) {
    try {
      const output = p.replace('page-image-resized', 'page-image-blurred');

      await makeDir(path.dirname(output));

      const image = await Jimp.read(p);
      await image.resize(imageWidth, Jimp.AUTO);
      await image.quality(20);
      await image.blur(5);
      await image.writeAsync(output);

      remained--;
      console.log(
        `image inside worder ${index} blurred, remained: ${remained} ${index}`
      );
    } catch (error) {
      console.log('image path', p);
      console.log('image embedding error', error);
    }
  }

  parentPort.postMessage(`Images are processed`);
}

blurImage();