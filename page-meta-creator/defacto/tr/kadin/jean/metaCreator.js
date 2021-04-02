const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { splitIntoCategory } = require('./split-into-category');

async function metaCreator({ input, output, output2 }) {
  debugger;
  const pageData = require(input);
  debugger;
  const outputFolder = path.dirname(output);
  const outputFolder2 = path.dirname(output2);
  await makeDir(outputFolder);
  await makeDir(outputFolder2);
  const data = await splitIntoCategory(pageData);
  const categoryName = path.basename(output, '.json');
  debugger;
  const category = data[categoryName];
  debugger;

  fs.writeFileSync(output, JSON.stringify(category));
  fs.writeFileSync(output2, JSON.stringify(category));
}

module.exports = {
  metaCreator
};
