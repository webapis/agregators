const Apify = require('apify');
const { pageUrlInjector } = require('./pageUrlInjector');

async function listScraper({
  page,
  mainMenuTitle,
  subMenuTitle,
  urlTitle,
  request,

  requestQueue,
}) {
  try {
    await page.waitForSelector('#products');

    const title = await page.title();
    await page.waitForSelector(
      '#products > div > div:last-child > div > div.picture > a > img'
    );
    debugger;
    const products = await page.$$eval(
      '.products-card',
      (els, _title, _mainMenuTitle, _subMenuTitle) =>
        els.map(($el) => {
          return {
            mainMenuTitle: _mainMenuTitle,
            subMenuTitle: _subMenuTitle,
            title: _title,
            dataDocument: $el.getAttribute('data-documents'),
            picture: {
              a: {
                detailLink: $el.querySelector('div.picture > a').href,
              },
              img: {
                scrset:
                  'https:' +
                  $el
                    .querySelector('div.picture > a > img')
                    .getAttribute('data-srcset'),
                placeHolder:
                  'https://dfcdn.defacto.com.tr/Assets/dist/images/product-place-holder.svg',
              },
            },
            onlineozel: {
              img: {
                src:
                  $el.querySelector('div.picture img[src*=onlineozell]') &&
                  $el.querySelector('div.picture img[src*=onlineozell]').src,
              },
            },
            buyukBeden: {
              img: {
                src:
                  $el.querySelector('div.picture img[src*=buyuk-beden]') &&
                  $el.querySelector('div.picture img[src*=buyuk-beden]').src,
              },
            },
            productInfo: {
              title:
                $el.querySelector('.product-info-title-link') &&
                $el.querySelector('.product-info-title-link').innerText,
              salePrice: $el.querySelector('.sale-price').innerText,
              marketPrice:
                $el.querySelector('.market-price') &&
                $el.querySelector('.market-price').innerText,
              discountRate:
                $el.querySelector('.discount-rate') &&
                $el.querySelector('.discount-rate').innerText,
              discountText:
                $el.querySelector('.discount-text') &&
                $el.querySelector('.discount-text').innerText,
            },
          };
        }),
      title,
      mainMenuTitle,
      subMenuTitle
    );
    const dataset = await Apify.openDataset(
      `${mainMenuTitle}.${subMenuTitle}.${urlTitle}`
    );
    await dataset.pushData(products);
    if (
      request.userData.mainMenuTitle &&
      request.url.indexOf('?lt=v2&page=') === -1
    ) {
      debugger;
      await pageUrlInjector({ request, requestQueue, page });
    }

    return products;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listScraper,
};

//#products > div > div::last-child > div > div.picture > a > img
