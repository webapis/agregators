/* eslint-disable no-prototype-builtins */
const { pageHandlers } = require('./pageHandlers');
const { nextPageUrls } = require('./nextPageUrls');
const Apify = require('apify');

async function handlePageFunction({ page, request, crawler }) {
  try {
    const { userData: { firstPage, folderName } } = request;

    const pageHandler = pageHandlers.find(p =>
      p.hasOwnProperty(process.env.MARKA)
    )[process.env.MARKA];

    const pageData = await pageHandler({ page, request });
    const nextUrls = nextPageUrls.find(p =>
      p.hasOwnProperty(process.env.MARKA)
    )[process.env.MARKA];
    debugger;
    if (firstPage) {
      const urls = await nextUrls({ page });
      debugger;
      await Promise.all(
        urls.map(async u => {
          await crawler.requestQueue.addRequest({
            url: u,
            userData: { folderName }
          });
        })
      );
    }
    const dataset = await Apify.openDataset(
      process.env.MARKA + '.' + folderName
    );
    await dataset.pushData(pageData);
    debugger;
  } catch (error) {
    debugger;
    throw error;
  }
}

module.exports = {
  handlePageFunction
};
