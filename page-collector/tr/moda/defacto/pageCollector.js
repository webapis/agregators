const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const makeDir = require('make-dir');

async function getNextPageContent({ url }) {
  const { window: { document } } = await JSDOM.fromURL(url);
  const content = document.getElementById('products').innerHTML;

  return content;
}

async function pageCollector({ input, output }) {
  try {
    const { window: { document } } = await JSDOM.fromURL(input);
    const content = document.getElementById('products').innerHTML;

    const productCount = document
      .querySelector('.product-count')
      .textContent.trim()
      .match(/\d+/g)[0];

    const pageCount = Math.round(parseInt(productCount) / 72);

    await makeDir(path.dirname(output));
    let nextPageContents = [];
    if (pageCount > 0) {
      let promises = [];
      for (let i = 1; i < pageCount; i++) {
        console.log('Collecting page:', i);

        promises.push(
          getNextPageContent({
            url: `https://www.defacto.com.tr/kadin-denim?lt=v2&page=${i}`
          })
        );
      }
      nextPageContents = await Promise.all(promises);
      const mergedPagesContent = content + nextPageContents;

      fs.writeFileSync(output, mergedPagesContent);
    } else {
      fs.writeFileSync(output, content);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  pageCollector
};
