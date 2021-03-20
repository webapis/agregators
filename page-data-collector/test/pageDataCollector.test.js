const { pageDataCollector } = require('../index');
const { defactoDataCollector } = require('../defacto/defactoDataCollector');
const { defactoNextPageUrls } = require('../defacto/defactoNextPageUrls');

describe('pageDataCollector test', () => {
  it('read page data', async function() {
    this.timeout(50000);
    try {
      debugger;
      await pageDataCollector({
        url: 'https://www.defacto.com.tr/kadin-denim',
        dataCollector: defactoDataCollector,
        pageUrlsGetter: defactoNextPageUrls
      });

      debugger;
    } catch (error) {
      debugger;
    }
  });
});
