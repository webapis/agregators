const fs = require('fs');
const { replaceUnicode } = require(`${process.cwd()}/utils/replaceUnicode`);
const makeDir = require('make-dir');
const { splitIntoCategory } = require('./split-into-category');

async function metaCreator({ input, output, output2 }) {
  try {
    debugger;
    const pageData = require(input);
    await makeDir(output);
    await makeDir(output2);
    const data = await splitIntoCategory(pageData);
    const removeUnicode = data.map(d => {
      return {
        ...d,
        category: replaceUnicode(d.category.toLowerCase().replace(/\s/g, ''))
      };
    });
    debugger;
    removeUnicode.forEach(d => {
      const category = d.category;

      fs.writeFileSync(`${output}/${category}.json`, JSON.stringify(d));
      fs.writeFileSync(`${output2}/${category}.json`, JSON.stringify(d));
    });
    debugger;
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  metaCreator
};
