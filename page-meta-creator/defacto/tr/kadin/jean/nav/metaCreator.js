const fs = require('fs');

function metaCreator({ input, output, output2, linkUrl }) {
  try {
    debugger;
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

    const withUrls = countProducts.map(c => {
      return { ...c, url: `${linkUrl}${c.productName.toLowerCase()}.html` };
    });
    debugger; //
    fs.writeFileSync(output, JSON.stringify(withUrls));
    fs.writeFileSync(output2, JSON.stringify(withUrls));

    console.log('nav/metaCreator is being tested');
  } catch (error) {
    debugger;
  }
}

module.exports = { metaCreator };
