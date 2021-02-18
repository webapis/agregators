const Apify = require('apify');
async function pageUrlInjector({ request, requestQueue, page }) {
  try {
    const {
      userData: { urlTitle, subMenuTitle, mainMenuTitle },
    } = request;

    debugger;
    const productCount = await page.$eval(
      '.product-count',
      (el) => el.textContent.trim().match(/\d+/g)[0]
    );
    debugger;
    if (parseInt(productCount) > 72) {
      debugger;
      const pageCount = Math.round(parseInt(productCount) / 72);
      let pageUrls = [];
      let i;
      for (i = 2; i <= pageCount; i++) {
        pageUrls.push(`${request.url}?lt=v2&page=${i}`);
      }
      debugger;
      for (const u of pageUrls) {
        debugger;
        const req = new Apify.Request({
          url: u,
          userData: {
            urlTitle,
            subMenuTitle,
            mainMenuTitle,
          },
        });
        await requestQueue.addRequest(req, { forefront: true });
        debugger;
      }
    }
  } catch (error) {
    debugger;
    throw error;
  }
}

module.exports = {
  pageUrlInjector,
};
