const fs = require('fs');
const { JSDOM } = require('jsdom');
const http = require('http');
const path = require('path');
const makeDir = require('make-dir');

async function getNextPageContent({ url }) {
  const { window: { document } } = await JSDOM.fromURL(url);
  const content = document.querySelector('.productGrid').innerHTML;

  return content;
}

async function pageCollector({ input, output, pageUrl }) {

  
  try {
    const { window: { document } } = await JSDOM.fromURL(input);

    const content = document.querySelector('.productGrid').innerHTML;
    debugger;
    await makeDir(path.dirname(output));
    if (document.querySelector('.paging')) {
      if (pageUrl === undefined) throw 'pageUrl not provided';
      const pagesCountString = Array.from(
        document.querySelector('.paging').querySelectorAll('li>a')
      ).map(m => m.innerHTML);
      const pagesCountIntager = Number.parseInt(
        pagesCountString.find((p, i) => i === pagesCountString.length - 2)
      );

      let nextPageContents = [];
      if (pagesCountIntager > 0) {
        let promises = [];
        for (let i = 1; i <= pagesCountIntager; i++) {
          console.log('Collecting page:', i);

          promises.push(
            getNextPageContent({
              url: `${pageUrl}${i}`
            })
          );
        }
        nextPageContents = await Promise.all(promises);
      }
      const mergedPagesContent = content + nextPageContents;
      fs.writeFileSync(output, mergedPagesContent);
    } else {
      fs.writeFileSync(output, content);
    }
  } catch (error) {
    debugger;
    throw error;
  }
}

module.exports = {
  pageCollector
};
