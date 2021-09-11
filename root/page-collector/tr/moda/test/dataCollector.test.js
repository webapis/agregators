const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
describe('dataCollector test', function() {
  it('tr/koton/dataCollector test', async function() {
    this.timeout(100000);
    const { dataCollector } = require('../koton/dataCollector');
    const input = `${process.cwd()}/page-collection/tr/moda/kadin/giyim/alt-giyim/jean-etek/koton.html`;
    const output = `${process.cwd()}/page-data/tr/moda/kadin/giyim/alt-giyim/jean-etek/koton.json`;
    await makeDir(path.dirname(output));
    const page = fs.readFileSync(input, { encoding: 'utf-8' });

    const data = await dataCollector({
      page
    });
    fs.writeFileSync(output, JSON.stringify(data));
  });
  it('tr/defacto/dataCollector test', async function() {
    this.timeout(100000);

    const { dataCollector } = require('../defacto/dataCollector');
    const input = `${process.cwd()}/page-collection/tr/moda/kadin/giyim/alt-giyim/jean-sort/defacto.html`;

    const output = `${process.cwd()}/page-data/tr/moda/kadin/giyim/alt-giyim/jean-sort/defacto.json`;
    await makeDir(path.dirname(output));
    const page = fs.readFileSync(input, { encoding: 'utf-8' });
    const data = await dataCollector({
      page
    });
    fs.writeFileSync(output, JSON.stringify(data));
  });
});
