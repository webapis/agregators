const Jimp = require('jimp');
const makeDir = require('make-dir');
const path = require('path');
const { parentPort, workerData } = require('worker_threads');
const { nextSlice, imageWidth, index } = workerData;

async function cropImage() {
  let remained = nextSlice.length;
  for (let p of nextSlice) {
    const output = p
      .replace('page-image', 'page-image-resized')
      .replace('original', imageWidth);
    await makeDir(path.dirname(output));

    const image = await Jimp.read(p);

    await image.resize(imageWidth, Jimp.AUTO);
    await image.quality(60);
    await image.writeAsync(output);
    remained--;
    console.log(
      `image inside worder ${index} processed, remained: ${remained} ${index}`
    );
  }

  parentPort.postMessage(`Images are processed`);
}

cropImage();
