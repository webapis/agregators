// This is the main Node.js source code file of your actor.
// It is referenced from the "scripts" section of the package.json file,
// so that it can be started by running "npm start".
const { handlePageFunction } = require('./handlePageFunction');
const Apify = require('apify');
//https://www.defacto.com.tr/kadin
Apify.main(async () => {
  const requestQueue = await Apify.openRequestQueue();
  debugger;
  const url = `https://www.defacto.com.tr`;
  debugger;
  const requestList = new Apify.RequestList({ sources: [url] });
  await requestList.initialize();
  debugger;
  const crawler = new Apify.PuppeteerCrawler({
    maxConcurrency: 10,
    maxRequestRetries: 1,
    // maxRequestsPerCrawl: 25,
    requestList,
    requestQueue,
    launchContext: {
      useChrome: true,
      launchOptions: {
        headless: true,
        slowMo: 100,
      },
    },
    handlePageFunction: handlePageFunction({ requestQueue }),
    handleFailedRequestFunction: async ({ request }) => {},
    preNavigationHooks: [
      async (crawlingContext, gotoOptions) => {
        const { page } = crawlingContext;
        await page.setRequestInterception(true);
        page.on('request', (interceptedRequest) => {
          if (interceptedRequest.resourceType() === 'image') {
            interceptedRequest.abort();
          } else {
            interceptedRequest.continue();
          }
        });
      },
    ],
  });

  await crawler.run();
});
