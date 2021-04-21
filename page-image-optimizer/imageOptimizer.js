var Jimp = require('jimp');
const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
async function imageOptimizer({ input, output, imgOutput, imageUrl }) {
  try {
    const data = fs.readFileSync(input, { encoding: 'utf-8' });
    const dataObject = JSON.parse(data);

    let modifiedDataObject = [];
    let remained = dataObject.length;
    const parallel = 30;
    for (let i = 0; i < dataObject.length; i += parallel) {
      remained = remained - parallel;
      console.log('remained', remained);
      const promises = [];
      for (let j = 0; j < parallel; j++) {
        const elem = i + j;
        const d = dataObject[elem];

        const { image: { src } } = d;
        if (src !== null) {
          promises.push(
            handleImage({
              imgOutput,
              src,
              remained,
              elem,
              modifiedDataObject,
              d,
              imageUrl
            })
          );
        }

        if (elem === dataObject.length - 1) {
          console.log('save file');
          fs.writeFileSync(output, JSON.stringify(modifiedDataObject));
        }
      }

      await Promise.all(promises);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = { imageOptimizer };

async function handleImage({
  imgOutput,
  src,
  modifiedDataObject,
  d,
  imageUrl
}) {
  try {
    const outputDir = imgOutput + '/288';
    await makeDir(path.dirname(outputDir));
    const filename = path.basename(src);
    const imageOutputPath = `${outputDir}/${filename}`;
    const relativeImageUrl = `${imageUrl}/288/${filename}`;
    modifiedDataObject.push({
      ...d,
      image: { ...d.image, src: relativeImageUrl }
    });

    const image = await Jimp.read(src);
    await image.resize(288, Jimp.AUTO);
    await image.quality(60);
    await image.writeAsync(imageOutputPath);

    console.log('src', src);
  } catch (error) {
    throw error;
  }
}
