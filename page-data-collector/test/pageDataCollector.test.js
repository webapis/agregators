const { pageDataCollector } = require('../index');
const { dataCollector } = require('../defacto/tr/dataCollector');
const { pageUrlsGetter } = require('../defacto/tr/pageUrlsGetter');

describe('pageDataCollector test', () => {
  it('read page data', async function() {
    this.timeout(50000);
    try {
      debugger;
      await pageDataCollector({
        url: 'https://www.defacto.com.tr/kadin-denim',
        dataCollector,
        pageUrlsGetter
      });

      debugger;
    } catch (error) {
      debugger;
    }
  });
});
