var Jimp = require('jimp');
const fs = require('fs');
const axios = require('axios');
const makeDir = require('make-dir');
const path = require('path');
async function imageSizeOptimizer({ input, imgOutput }) {
  try {
    const data = fs.readFileSync(input, { encoding: 'utf-8' });

    const dataObject = JSON.parse(data);
    const imageUrl = imgOutput.substring(imgOutput.indexOf('/tr/'));

    let remained = dataObject.length;
    const parallel = 10;
    for (let i = 0; i < dataObject.length; i += parallel) {
      const promises = [];

      for (let j = 0; j < parallel; j++) {
        const elem = i + j;
        if (elem < dataObject.length) {
          remained = remained - 1;
          console.log('remained of', input, remained);

          const d = dataObject[elem];

          const { image: { optsrc } } = d;
          if (optsrc === null) {
            console.log('src is null');
            continue;
          }

          const imgFIleName = path.basename(optsrc);
          const imagePath = `${path.dirname(input)}/img/${imgFIleName}`.replace(
            'page-data',
            'page-image'
          );

          promises.push(
            optimizeImage({
              imgOutput,
              src: imagePath,
              remained,
              elem,
              dataObject,
              d,
              imageUrl
            })
          );
          if (remained === 0) {
            console.log('save file');
          }
        }
      }

      await Promise.all(promises);
      return dataObject;

      //fs.writeFileSync(output, JSON.stringify(dataObject));
    }
  } catch (error) {
    debugger;
    console.log('imageSizeOptimizer error.....', error.message);
  }
}

module.exports = { imageSizeOptimizer };

async function optimizeImage({
  imgOutput,
  src,
  dataObject,
  elem,
  d,
  imageUrl
}) {
  try {
    const outputDir = imgOutput + '/288';

    await makeDir(outputDir);

    const filename = path.basename(src);

    const imageOutputPath = `${outputDir}/${filename}`;
    const relativeImageUrl = `${imageUrl}/288/${filename} 288w`;
    const updated = {
      ...d,
      image: { ...d.image, 'data-srcset': relativeImageUrl }
    };
    dataObject.splice(elem, 1, updated);

    console.log('fetching image started...', src);
    // const { data } = await axios.get(src, {
    //   responseType: 'arraybuffer'
    // });
    const buffer = fs.readFileSync(src);
    
    const image = await Jimp.read(buffer);
    debugger;
    await image.resize(288, Jimp.AUTO);
    await image.quality(60);
    await image.writeAsync(imageOutputPath);
debugger;
    await blurImage({
      imgOutput,
      image: image.clone(),
      filename,
      d: updated,
      elem,
      dataObject,
      imageUrl
    });
  } catch (error) {
    debugger;
    console.log('optimizeImage error src', src);
    console.log('optimizeImage error', error);
  }
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
