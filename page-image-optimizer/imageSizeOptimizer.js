var Jimp = require('jimp');
const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
async function imageSizeOptimizer({ input, output, imgOutput, imageUrl }) {
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
            optimizeImage({
              imgOutput,
              src,
              remained,
              elem,
              dataObject,
              d,
              imageUrl
            })
          );
        }

        if (elem === dataObject.length - 1) {
          console.log('save file');
          fs.writeFileSync(output, JSON.stringify(dataObject));
        }
      }

      await Promise.all(promises);
    }
  } catch (error) {
    debugger;
    throw error;
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

    // modifiedDataObject.push({
    //   ...d,
    //   image: { ...d.image, src: relativeImageUrl }
    // });

    const image = await Jimp.read(src);
    await image.resize(288, Jimp.AUTO);
    await image.quality(60);
    await image.writeAsync(imageOutputPath);

    await blurImage({
      imgOutput,
      image: image.clone(),
      filename,
      d: updated,
      elem,
      dataObject,
      imageUrl
    });
    console.log('src', src);
  } catch (error) {
    debugger;
    throw error;
  }
}

async function blurImage({
  imgOutput,
  image,
  filename,
  imageUrl,
  dataObject,
  elem,
  d
}) {
  try {
    const outputDirName = `${imgOutput}/blur/288`;
    const relativeImageUrl = `${imageUrl}/blur/288/${filename}`;

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
    debugger;
    console.error(err);
  }
}
