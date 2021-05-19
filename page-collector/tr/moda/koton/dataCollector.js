const { JSDOM } = require('jsdom');
const { itemDataCollector } = require('./itemDataCollector');
function dataCollector({ page }) {
  const { window: { document } } = new JSDOM(page);
  let products = [];
  const productItems = document.querySelectorAll('div.product-item');
  productItems.forEach(p => {
    const product = itemDataCollector({ html: p.outerHTML });
    products.push(product);
  });
  const productsWithoutEmpty = products.filter(p => p.detailPageLink !== null);

  return productsWithoutEmpty;
}

module.exports = {
  dataCollector
};
