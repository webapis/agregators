const fs = require('fs');
const makeDir = require('make-dir');
const { joinDataSetItems } = require('./joinDataSetItems');
const { splitIntoCategory } = require('./split-into-category');
const pageData = require(`${process.cwd()}/page-data/defacto/kadin/kadin-jeans.json`);
debugger;
async function defactoKadynJeanMetaData() {
  const outputFolder = `${process.cwd()}/page-meta-data/defacto/kadin`;
  await makeDir(outputFolder);

  //const joinedItems = await joinDataSetItems(pageData);
  const data = await splitIntoCategory(pageData, 'kadin');
  debugger;
  for (const d in data) {
    const current = data[d];
    debugger;
    const filePath = `${outputFolder}/${current.pageName}.json`;
    debugger;
    fs.writeFileSync(filePath, JSON.stringify(current));
  }
}

module.exports = {
  defactoKadynJeanMetaData
};
