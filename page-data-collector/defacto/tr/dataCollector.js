async function dataCollector({ page }) {
  await page.waitForSelector('#products');

  const pageTitle = await page.title();
  const pageDescription = await page.$eval('meta[name=description]', el =>
    el.getAttribute('content')
  );

  await page.waitForSelector(
    '#products > div > div:last-child > div > div.picture > a > img'
  );
  const products = await page.$$eval('.products-card', els =>
    els.map($el => {
      return {
        detailPageLink: $el
          .querySelector('div.picture > a')
          .getAttribute('href'),
        image: {
          scrset:
            'https:' +
            $el
              .querySelector('div.picture > a > img')
              .getAttribute('data-srcset'),
          placeHolder:
            'https://dfcdn.defacto.com.tr/Assets/dist/images/product-place-holder.svg',
          alt: $el.querySelector('div.picture > a > img').getAttribute('alt')
        },
        productName:
          $el.querySelector('.product-info-title-link') &&
          $el.querySelector('.product-info-title-link').innerText,
        price: {
          salePrice: $el.querySelector('.sale-price').innerText,
          marketPrice:
            $el.querySelector('.market-price') &&
            $el.querySelector('.market-price').innerText
        },
        discount: {
          discountRate:
            $el.querySelector('.discount-rate') &&
            $el.querySelector('.discount-rate').innerText,
          discountText:
            $el.querySelector('.discount-text') &&
            $el.querySelector('.discount-text').innerText
        },
        onlineOzel:
          $el.querySelector('img[alt="patlangac/onlineozell.png"]') && true,
        yeniSezon:
          $el.querySelector('img[alt="patlangac/yenisezon.png"]') && true,
        buyukBeden:
          $el.querySelector('img[alt="patlangac/buyuk-beden-r.png"]') && true,
        organik: $el.querySelector('img[alt="patlangac/organic1.png"]') && true
      };
    })
  );

  return products;
}
module.exports = {
  dataCollector
};
