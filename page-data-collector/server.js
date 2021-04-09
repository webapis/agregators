const { pageDataCollector } = require('./pageDataCollector');
const pages = [
  {
    input: 'https://www.defacto.com.tr/kadin-denim',
    output: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
    dataCollectorFunc: './defacto/tr/dataCollector.js',
    pageUrlsGetterFunc: './defacto/tr/pageUrlsGetter.js'
  }
];
pages.map(async p => {
  const { input, dataCollectorFunc, pageUrlsGetterFunc, output } = p;
  const { dataCollector } = require(dataCollectorFunc);
  const { pageUrlsGetter } = require(pageUrlsGetterFunc);
  await pageDataCollector({
    url: input,
    dataCollector,
    pageUrlsGetter,
    output
  });

  console.log('data collected.......');
});
