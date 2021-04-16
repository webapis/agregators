const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const makeDir = require('make-dir');

async function getNextPageContent({ url }) {
  debugger;
  const { window: { document } } = await JSDOM.fromURL(url);
  const content = document.getElementById('products').innerHTML;
  debugger;
  return content;
}

async function pageCollector({ input, output }) {
  try {
    debugger;
    const { window: { document } } = await JSDOM.fromURL(input);
    const content = document.getElementById('products').innerHTML;

    debugger;
    const productCount = document
      .querySelector('.product-count')
      .textContent.trim()
      .match(/\d+/g)[0];
    debugger;

    const pageCount = Math.round(parseInt(productCount) / 72);
    debugger;
    await makeDir(path.dirname(output));
    let nextPageContents = [];
    if (pageCount > 0) {
      debugger;
      let promises = [];
      for (let i = 1; i < pageCount; i++) {
        console.log('Collecting page:', i);
        debugger;
        promises.push(
          getNextPageContent({
            url: `https://www.defacto.com.tr/kadin-denim?lt=v2&page=${i}`
          })
        );
      }
      nextPageContents = await Promise.all(promises);

      debugger;
    }
    debugger;
    const mergedPagesContent = content + nextPageContents;
    debugger;
    fs.writeFileSync(output, mergedPagesContent);

    debugger;
  } catch (error) {
    debugger;
  }
}

module.exports = {
  pageCollector
};
