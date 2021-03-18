require('dotenv').config();
// const { handlePageFunction } = require('./handlePageFunction');
// const { firstPageUrls } = require('./firstPageUrls');
// const Apify = require('apify');
async function Scraper() {
  try {
    // const requestQueue = await Apify.openRequestQueue();

    // debugger;
    // const urls = firstPageUrls.find(f => f.marka === process.env.MARKA)
    //   .firstPageUrls;

    // const sources = urls.map(s => {
    //   return {
    //     url: s.pageUrl,
    //     method: 'GET',
    //     userData: { firstPage: true, folderName: s.folderName }
    //   };
    // });

    // for (const s of sources) {
    //   await requestQueue.addRequest(s);
    // }

    // debugger;
    // const crawler = new Apify.PuppeteerCrawler({
    //   maxConcurrency: 10,
    //   maxRequestRetries: 1,
    //   // maxRequestsPerCrawl: 25,
    //   requestQueue,
    //   launchContext: {
    //     useChrome: true,
    //     launchOptions: {
    //       headless: true,
    //       slowMo: 100
    //     }
    //   },
    //   handlePageFunction,

    //   preNavigationHooks: [
    //     async crawlingContext => {
    //       const { page } = crawlingContext;
    //       await page.setRequestInterception(true);
    //       page.on('request', async interceptedRequest => {
    //         if (interceptedRequest.resourceType() === 'image') {
    //           interceptedRequest.abort();
    //         } else {
    //           interceptedRequest.continue();
    //         }
    //       });
    //     }
    //   ]
    // });

    // await crawler.run();
  
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  Scraper
};
