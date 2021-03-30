const fs = require('fs');
const makeDir = require('make-dir');
const { splitIntoCategory } = require('./split-into-category');
const pageData = require(`${process.cwd()}/page-data/defacto/kadin/kadin-jeans.json`);

async function defactoKadynJeanMetaData() {
  const outputFolder = `${process.cwd()}/page-build/defacto/kadin/jean`;
  //const outputFolder2 = `${process.cwd()}/public/defacto/kadin/jean`;
  await makeDir(outputFolder);
  //await makeDir(outputFolder2);
  //const joinedItems = await joinDataSetItems(pageData);
  const data = await splitIntoCategory(pageData, 'kadin');
  debugger;
  for (const d in data) {
    const current = data[d];
    const filePath = `${outputFolder}/${current.pageName}.json`;
    //const filePath2 = `${outputFolder2}/${current.pageName}.json`;
    debugger;
    console.log('filePath||||||', filePath);
    fs.writeFileSync(filePath, JSON.stringify(current));
    //fs.writeFileSync(filePath2, JSON.stringify(current));
  }
}

module.exports = {
  defactoKadynJeanMetaData
};
