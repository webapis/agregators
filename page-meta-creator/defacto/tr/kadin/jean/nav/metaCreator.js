const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
 function metaCreator({ input, output, output2 }) {
  try {
   // const outputFolder2 = path.dirname(output2);
   // await makeDir(outputFolder2);
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

    fs.writeFileSync(output, JSON.stringify(countProducts));
    fs.writeFileSync(output2, JSON.stringify(countProducts));
    debugger;
    console.log('nav/metaCreator is being tested');
  } catch (error) {
    debugger;
  }
}

module.exports = { metaCreator };
