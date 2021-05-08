const Jimp = require('jimp');
const makeDir = require('make-dir');
const path = require('path');
const { parentPort, workerData } = require('worker_threads');
const { nextSlice, imageWidth, index } = workerData;

async function blurImage() {
  let remained = nextSlice.length;
  for (let p of nextSlice) {
    const output = p.replace('page-image-resized', 'page-image-blurred');

    await makeDir(path.dirname(output));

    const image = await Jimp.read(p);
    debugger;
    await image.resize(imageWidth, Jimp.AUTO);
    await image.quality(20);
    await image.blur(5);
    await image.writeAsync(output);

    debugger;
    remained--;
    console.log(
      `image inside worder ${index} blurred, remained: ${remained} ${index}`
    );
  }

  parentPort.postMessage(`Images are processed`);
}

blurImage();
