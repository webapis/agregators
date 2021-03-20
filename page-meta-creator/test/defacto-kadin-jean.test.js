const {
  defactoKadynJeanMetaData
} = require('../defacto/kadin/jean/defacto.kadyn.jean.metadata');
const pageData = require('../../page-data/defacto/kadin/kadin-jeans.json');

const fs = require('fs');
const makeDir = require('make-dir');

describe('Defacto Kadin Jean Meta creator', () => {
  it('test defactoKadynJeanMetaData ', async function() {
    this.timeout(50000);
    const outputFolder = `${process.cwd()}/page-meta-data/defacto/kadin`;
    await makeDir(outputFolder);

    const data = await defactoKadynJeanMetaData(pageData);
    debugger;
    for (const d in data) {
      const current = data[d];
      debugger;
      const filePath = `${outputFolder}/${current.pageName}.json`;
      debugger;
      fs.writeFileSync(filePath, JSON.stringify(current));
    
    }
    debugger;
  });
});
