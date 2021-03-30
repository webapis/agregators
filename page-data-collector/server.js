const { pages } = require('../pages');
const { pageDataCollector } = require('./index');
pages.map(async p => {
  try {
    debugger;
    if (p.dataCollection) {
      debugger;
      const {
        dataCollection: { pageUrlsGetter, sourceUrl, dataCollector, output }
      } = p;
      await pageDataCollector({
        url: sourceUrl,
        dataCollector,
        pageUrlsGetter,
        output
      });
      debugger;
    }
  } catch (error) {
    debugger;
  }
});
