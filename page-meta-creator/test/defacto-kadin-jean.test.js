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
    for (const d in data) {
      const filePath = `${outputFolder}/${d}.json`;
      const current = data[d];
      fs.writeFileSync(filePath, JSON.stringify(current));
      debugger;
    }
    debugger;
  });
});
