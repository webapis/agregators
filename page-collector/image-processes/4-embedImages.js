const Jimp = require('jimp');
const makeDir = require('make-dir');
const path = require('path');
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const { nextSlice, imageWidth, index } = workerData;

async function embedImage() {
  let remained = nextSlice.length;

  debugger;
  for (let p of nextSlice) {
    const data = fs.readFileSync(p);
    const dataObject = JSON.parse(data);
    const embeddedDataObject = await Promise.all(
      dataObject.filter(d => d.image.optsrc !== null).map(async (d, i) => {
        const { image: { optsrc } } = d;
        // if (optsrc !== null) {
        const filename = path.basename(optsrc);
        const directory = path
          .dirname(p)
          .replace('page-data', 'page-image-blurred');
        const imageFolder = `/img/${imageWidth}/`;
        const imagePath = `${directory}${imageFolder}${filename}`;

        const image = await Jimp.read(imagePath);

        const dataURL = await image.getBase64Async(Jimp.AUTO);

        const nextState = { ...d, image: { ...d.image, src: `${dataURL}` } };

        return nextState;
      })
    );
    console.log(
      `image embeded wt is :${index} total:${dataObject.length} file${p}`
    );
    fs.writeFileSync(p, JSON.stringify(embeddedDataObject));
    debugger;
  }
  debugger;

  parentPort.postMessage(`Images are processed`);
}

embedImage();
