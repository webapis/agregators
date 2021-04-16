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
    const CategoryNames = arrayOfObjects.map(a => {
      return a.category;
    });

    const dublicateRemoved = CategoryNames.filter(
      (value, index) => CategoryNames.indexOf(value) === index
    );

    const countProducts = dublicateRemoved.reduce((acc, curr, index) => {
      const totalItems = CategoryNames.filter(pName => pName === curr).length;
      if (index === 0) {
        return [{ productName: curr, totalItems }];
      }
      return [...acc, { productName: curr, totalItems }];
    }, []);

    const withUrls = countProducts.map(c => {
      const productName = replaceUnicode(c.productName).toLowerCase();

      const { image } = arrayOfObjects.find(a => a.category === c.productName);

      return {
        ...c,
        productName,
        productNameLabel: `JEAN ${c.productName}`,
        srcset: '',
        url: `${linkUrl}${productName}.html`,
        image
      };
    });

    fs.writeFileSync(output, JSON.stringify(withUrls));
    fs.writeFileSync(output2, JSON.stringify(withUrls));

    console.log('nav/metaCreator is being tested');

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = { metaCreator };
