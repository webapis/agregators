const Apify = require('apify');
const {
  utils: { enqueueLinks },
} = Apify;

async function urlInjector({
  page,
  requestQueue,
  productUrls,
  forefront = false,
}) {
  for (const p of productUrls) {
    var {
      mainMenu: { mainMenuTitle, url },
      subMenu,
    } = p;

    for (const s of subMenu) {
      var { subMenuTitle, urls } = s;
      for (const u of urls) {
        const { urlTitle, url } = u;
        const request = new Apify.Request({
          url,
          userData: {
            urlTitle,
            subMenuTitle,
            mainMenuTitle,
          },
        });

        await requestQueue.addRequest(request, { forefront });
      }
    }
  }

  return requestQueue;
  try {
  } catch (error) {
    throw error;
  }
}

module.exports = {
  urlInjector,
};
