const { JSDOM } = require('jsdom');

const { itemDataCollector } = require('./itemDataCollector');

function dataCollector({ page }) {
  const { window: { document } } = new JSDOM(page);
  let products = [];
  const productItems = document.querySelectorAll('.products-card');
  productItems.forEach(p => {
    const product = itemDataCollector({ html: p.outerHTML });
    products.push(product);
  });
  return products;
}
module.exports = {
  dataCollector
};
