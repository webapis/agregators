const Jimp = require('jimp');
const { parentPort, workerData } = require('worker_threads');
const { nextSlice } = workerData;

async function cropImage() {
  for (let p of nextSlice) {
    const image = await Jimp.read(p);

    // const filePath = nextSlice[i];
    // promises.push();
    debugger;
  }
  debugger;

  parentPort.postMessage(`Images are processed`);
}

cropImage();
