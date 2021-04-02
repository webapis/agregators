const { pages } = require('../pages');
const { pageDataCollector } = require('./pageDataCollector');

pages.filter(p => p.pageData !== null).map(async p => {
  const {
    pageData: { input, dataCollectorFunc, pageUrlsGetterFunc, output }
  } = p;
  const { dataCollector } = require(dataCollectorFunc);
  const { pageUrlsGetter } = require(pageUrlsGetterFunc);
  await pageDataCollector({
    url: input,
    dataCollector,
    pageUrlsGetter,
    output
  });

  console.log('data collected.......')
  debugger;
});
