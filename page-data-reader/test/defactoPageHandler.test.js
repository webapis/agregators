const { pageContentReader } = require('../index');
const { defactoPageHandler } = require('../defacto/defactoPageHandler');
const { defactoNextPageUrls } = require('../defacto/defactoNextPageUrls');

const fs = require('fs');
const makeDir = require('make-dir');
describe('defactoPageHandler', () => {
  it('read page data', async function() {
    this.timeout(50000);
    try {
      const outputFolder = `${process.cwd()}/page-data/defacto/kadin`;
      await makeDir(outputFolder);
      const filePath = `${outputFolder}/kadin-jeans.json`;
      debugger;
      const result = await pageContentReader({
        url: 'https://www.defacto.com.tr/kadin-denim',
        pageHandler: defactoPageHandler,
        pageUrlsGetter: defactoNextPageUrls
      });
      fs.writeFileSync(filePath, JSON.stringify(result));
      debugger;
    } catch (error) {
      debugger;
    }
  });
});
