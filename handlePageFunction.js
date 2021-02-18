const Apify = require('apify');
const { urlInjector } = require('./defacto/urlInjector');
const { listScraper } = require('./defacto/listScraper');
const { getProductUrls } = require('./defacto/getProducturls');
function handlePageFunction({ requestQueue }) {
  return async function ({ page, request }) {
    try {
      const {
        url,
        userData: { mainMenuTitle, subMenuTitle, urlTitle },
      } = request;

      if (!request.userData.mainMenuTitle) {
        debugger;
        const productUrls = await getProductUrls({ page });
        debugger;
        await urlInjector({
          page,
          requestQueue,
          productUrls,
        });
        debugger;
      } else {
        debugger;
        const products = await listScraper({
          page,
          mainMenuTitle,
          subMenuTitle,
          urlTitle,
          request,

          requestQueue,
        });

        debugger;
      }
    } catch (error) {
      debugger;
      throw error;
    }
  };
}
//?lt=v2&page=
module.exports = {
  handlePageFunction,
};
