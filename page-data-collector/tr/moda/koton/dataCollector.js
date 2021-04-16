const fs = require('fs');
const { JSDOM } = require('jsdom');
const makeDir = require('make-dir');
const path = require('path');
const { itemDataCollector } = require('./itemDataCollector');
async function dataCollector({ input, output }) {
  debugger;
  const data = fs.readFileSync(input, { encoding: 'utf-8' });
  await makeDir(path.dirname(output));
  const { window: { document } } = new JSDOM(data);
  let products = [];
  const productItems = document.querySelectorAll('.product-item');
  productItems.forEach(p => {
    const product = itemDataCollector({ html: p.outerHTML });
    products.push(product);
  });
  debugger;
  const productsWithoutEmpty = products.filter(p => p.detailPageLink !== null);
  debugger;
  fs.writeFileSync(output, JSON.stringify(productsWithoutEmpty));
}

module.exports = {
  dataCollector
};
