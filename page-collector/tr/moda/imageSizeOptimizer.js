var Jimp = require('jimp');
const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
const EventEmitter = require('events');
const { uuidv4 } = require('../../uuidv4');
const eventEmitter = new EventEmitter();
let totalConcur = 20;
let queue = [];
let promises = [];

eventEmitter.on('promiseAttached', promise => {
  if (promises.length <= totalConcur) {
    promises.push(promise);
    promise()
      .then(() => {
        debugger;
        eventEmitter.emit('promiseResolved', promise);
      })
      .catch(e => {
        eventEmitter.emit('promiseRejected', { promise, error: e });
      });
  } else {
    queue.push(promise);
  }
});

eventEmitter.on('promiseResolved', promise => {
  const { uuidv4 } = promise;
  debugger;
  const promiseToRemoveIndex = promises.findIndex(p => p.uuidv4 === uuidv4);
  debugger;
  promises.splice(promiseToRemoveIndex, 1);
  if (queue.length > 0) {
    const nextpromise = queue[0];
    debugger;
    promises.push(nextpromise);
    queue.shift();
    nextpromise()
      .then(() => {
        eventEmitter.emit('promiseResolved', promise);
      })
      .catch(error => {
        eventEmitter.emit('promiseRejected', { promise, error });
      });

    debugger;
    console.log('queue length', queue.length);
    console.log('promises length', promises.length);
  } else {
    console.log('queue is complete');
  }
});
function imageSizeOptimizer({ input, imgOutput }) {
  try {
    const data = fs.readFileSync(input, { encoding: 'utf-8' });
    const dataObject = JSON.parse(data);
    const imageUrl = imgOutput.substring(imgOutput.indexOf('/tr/'));

    dataObject.forEach((d, i) => {
      const { image: { optsrc } } = d;
      if (optsrc === null) {
        console.log('src is null');
        return;
      }
      const imgFIleName = path.basename(optsrc);
      const imagePath = `${path.dirname(input)}/img/${imgFIleName}`.replace(
        'page-data',
        'page-image'
      );

      const promise = optimizeImage({
        imgOutput,
        src: imagePath,

        elem: i,
        dataObject,
        d,
        imageUrl
      });
      promise.uuidv4 = uuidv4();

      eventEmitter.emit('promiseAttached', promise);
    });

    return dataObject;

    //fs.writeFileSync(output, JSON.stringify(dataObject));
  } catch (error) {
    debugger;
    console.log('imageSizeOptimizer error.....', error.message);
  }
}

module.exports = { imageSizeOptimizer };

function optimizeImage({ imgOutput, src, dataObject, elem, d, imageUrl }) {
  return () =>
    new Promise((resolve, reject) => {
      try {
        const outputDir = imgOutput + '/288';
        makeDir(outputDir)
          .then(async () => {
            const filename = path.basename(src);
            const imageOutputPath = `${outputDir}/${filename}`;
            const relativeImageUrl = `${imageUrl}/288/${filename} 288w`;
            const updated = {
              ...d,
              image: { ...d.image, 'data-srcset': relativeImageUrl }
            };
            dataObject.splice(elem, 1, updated);

            console.log('optimizing image...', src);

            const image = await Jimp.read(src);

            await image.resize(288, Jimp.AUTO);
            await image.quality(60);

            await image.writeAsync(`page-build/${imageOutputPath}`);

            await blurImage({
              imgOutput,
              image: image.clone(),
              filename,
              d: updated,
              elem,
              dataObject,
              imageUrl
            });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        debugger;
        console.log('optimizeImage error src', src);
        console.log('optimizeImage error', error);
        reject(error);
      }
    });
}

async function blurImage({ imgOutput, image, filename, dataObject, elem, d }) {
  try {
    const outputDirName = `${imgOutput}/blur/288`;

    await makeDir(outputDirName);
    await image.resize(255, Jimp.AUTO);
    await image.quality(20);
    await image.blur(5);

    const dataURL = await image.getBase64Async(Jimp.AUTO);
    dataObject.splice(elem, 1, {
      ...d,
      image: { ...d.image, src: dataURL }
    });

    await image.writeAsync(`${outputDirName}/${filename}`);
  } catch (err) {
    console.log('blurImage() error...', err);
  }
}
