const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { splitIntoCategory } = require('./split-into-category');

async function metaCreator({ input, output, output2 }) {
  try {
    const pageData = require(input);
    await makeDir(output);
    await makeDir(output2);
    const data = await splitIntoCategory(pageData);
    data.forEach(d => {
      const productName = d.productName;
      fs.writeFileSync(
        `${output}/${productName}.json`,
        JSON.stringify(d)
      );
      fs.writeFileSync(
        `${output2}/${productName}.json`,
        JSON.stringify(d)
      );
    });
 
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  metaCreator
};
