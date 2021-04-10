const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
const { replaceUnicode } = require(`${process.cwd()}/utils/replaceUnicode`);
async function metaCreator({ input, output, output2, linkUrl }) {
  try {
    await makeDir(path.dirname(output));
    await makeDir(path.dirname(output2));
    const rawData = fs.readFileSync(input, 'utf-8');
    const arrayOfObjects = JSON.parse(rawData);
    const extracProductName = arrayOfObjects.map(a => {
      const splitted = a.productName.split(' ');
      const lastword = splitted[splitted.length - 1];
      return lastword;
    });

    const dublicateRemoved = extracProductName.filter(
      (value, index) => extracProductName.indexOf(value) === index
    );

    const countProducts = dublicateRemoved.reduce((acc, curr, index) => {
      const totalItems = extracProductName.filter(pName => pName === curr)
        .length;
      if (index === 0) {
        return [{ productName: curr, totalItems }];
      }
      return [...acc, { productName: curr, totalItems }];
    }, []);
debugger;
    const withUrls = countProducts.map(c => {
      debugger;
      const productName = replaceUnicode(c.productName).toLowerCase();
      return {
        ...c,
        productName,
        productNameLabel: c.productName,
        srcset: '',
        url: `${linkUrl}${productName}.html`
      };
    });

    debugger;
    fs.writeFileSync(output, JSON.stringify(withUrls));
    fs.writeFileSync(output2, JSON.stringify(withUrls));

    console.log('nav/metaCreator is being tested');

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = { metaCreator };
