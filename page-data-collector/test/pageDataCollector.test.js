const { pageDataCollector } = require('../index');
const { defactoDataCollector } = require('../defacto/defactoDataCollector');
const { defactoNextPageUrls } = require('../defacto/defactoNextPageUrls');

const fs = require('fs');
const makeDir = require('make-dir');
describe('pageDataCollector test', () => {
  it('read page data', async function() {
    this.timeout(50000);
    try {
      const outputFolder = `${process.cwd()}/page-data/defacto/kadin`;
      await makeDir(outputFolder);
      const filePath = `${outputFolder}/kadin-jeans.json`;
    debugger;
      const result = await pageDataCollector({
        url: 'https://www.defacto.com.tr/kadin-denim',
        dataCollector: defactoDataCollector,
        pageUrlsGetter: defactoNextPageUrls
      });
      fs.writeFileSync(filePath, JSON.stringify(result));
      debugger;
    } catch (error) {
      debugger;
    }
  });
});
