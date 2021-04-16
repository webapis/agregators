const { JSDOM } = require('jsdom');
function itemDataCollector({ html }) {
  const { window: { document } } = new JSDOM(html);
  try {
    const product = {
      detailPageLink: document.querySelector('a')
        ? `https://www.koton.com/tr/${document.querySelector('a').href}`
        : null,
      image: {
        src: document.querySelector('.swiper-slide img')
          ? document.querySelector('.swiper-slide img').getAttribute('data-src')
          : null,
        placeHolder:
          'https://img-kotonw.mncdn.com/_ui/shared/images/koton-loading-gif2.gif',
        alt: document.querySelector('.swiper-slide img')
          ? document.querySelector('.swiper-slide img').alt
          : null
      },
      productName: document
        .querySelector('.product-item')
        .getAttribute('data-name')
        .trim(),
      price: {
        firstPrice: document.querySelector('.firstPrice')
          ? document
              .querySelector('.firstPrice')
              .innerHTML.replace('\n', '')
              .replace(/\s/g, '')
          : null,
        insteadPrice: document.querySelector('.insteadPrice')
          ? document
              .querySelector('.insteadPrice s')
              .innerHTML.replace('\n', '')
              .replace(/\s/g, '')
          : null,
        newPrice: document.querySelector('.newPrice')
          ? document
              .querySelector('.newPrice')
              .innerHTML.replace('\n', '')
              .replace(/\s/g, '')
          : null
      },
      discount: {
        discountRate: document.getElementById('discount-product-badge')
          ? document
              .getElementById('discount-product-badge')
              .textContent.replace(/\n/g, '')
              .replace(/\s/g, '')
          : null
      }
    };
    return product;
  } catch (error) {
    debugger;
  }
}

module.exports = {
  itemDataCollector
};
