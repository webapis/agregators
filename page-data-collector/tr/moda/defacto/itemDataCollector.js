const { JSDOM } = require('jsdom');
function itemDataCollector({ html }) {
  const { window: { document } } = new JSDOM(html);
  const imageSrc = document
    .querySelector('div.picture > a > img')
    .getAttribute('data-srcset');
  const imageUrl = imageSrc
    .substring(imageSrc.lastIndexOf('//'))
    .replace('3000w', '').trim();
  const product = {
    detailPageLink:
      `https://www.defacto.com.tr/` +
      document.querySelector('div.picture > a').getAttribute('href'),
    image: {
      src: 'https:' + imageUrl,
      //   placeHolder:
      //     'https://dfcdn.defacto.com.tr/Assets/dist/images/product-place-holder.svg',
      alt: document.querySelector('div.picture > a > img').getAttribute('alt')
    },
    productName:
      document.querySelector('.product-info-title-link') &&
      document.querySelector('.product-info-title-link').textContent.trim(),
    price: {
      salePrice: document.querySelector('.sale-price').textContent,
      marketPrice:
        document.querySelector('.market-price') &&
        document.querySelector('.market-price').textContent
    },
    discount: {
      discountRate:
        document.querySelector('.discount-rate') &&
        document.querySelector('.discount-rate').textContent,
      discountText:
        document.querySelector('.discount-text') &&
        document.querySelector('.discount-text').textContent
    },
    onlineOzel:
      document.querySelector('img[alt="patlangac/onlineozell.png"]') && true,
    yeniSezon:
      document.querySelector('img[alt="patlangac/yenisezon.png"]') && true,
    buyukBeden:
      document.querySelector('img[alt="patlangac/buyuk-beden-r.png"]') && true,
    organik: document.querySelector('img[alt="patlangac/organic1.png"]') && true
  };
  debugger;
  return product;
}

module.exports = {
  itemDataCollector
};
