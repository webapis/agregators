const { handlePageFunction } = require('./handlePageFunction');
const { firstPageUrls } = require('./firstPageUrls');
const Apify = require('apify');
Apify.main(async () => {
  const requestQueue = await Apify.openRequestQueue();
  const urls = firstPageUrls.filter(
    url => url.marka === process.env.MARKA.toLowerCase()
  );
  const sources = urls.map(s => {
    return {
      url: s.pageUrl,
      method: 'GET',
      userData: { firstPage: true, folderName: s.folderName }
    };
  });

  for (const s of sources) {
    await requestQueue.addRequest(s);
  }

  debugger;
  const crawler = new Apify.PuppeteerCrawler({
    maxConcurrency: 10,
    maxRequestRetries: 1,
    // maxRequestsPerCrawl: 25,
    requestQueue,
    launchContext: {
      useChrome: true,
      launchOptions: {
        headless: true,
        slowMo: 100
      }
    },
    handlePageFunction,

    preNavigationHooks: [
      async crawlingContext => {
        const { page } = crawlingContext;
        await page.setRequestInterception(true);
        page.on('request', async interceptedRequest => {
          if (interceptedRequest.resourceType() === 'image') {
            interceptedRequest.abort();
          } else {
            interceptedRequest.continue();
          }
        });
      }
    ]
  });

  await crawler.run();
});
