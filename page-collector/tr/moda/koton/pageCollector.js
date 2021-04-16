const fs = require('fs');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const path = require('path');
const makeDir = require('make-dir');

async function getNextPageContent({ url }) {
  try {
    debugger;
    const { data } = await axios.get(url);
    debugger;
    const { window: { document } } = new JSDOM(data);

    const content = document.querySelector('.productGrid').innerHTML;

    return content;
  } catch (error) {
    debugger;
    throw error;
  }
}

async function pageCollector({ input, output, pageUrl }) {
  try {
    const { data } = await axios.get(input);

    const { window: { document } } = new JSDOM(data);

    const content = document.querySelector('.productGrid').innerHTML;

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
        debugger;
        let promises = [];
        for (let i = 1; i < pagesCountIntager; i++) {
          console.log('Collecting page:', i);

          promises.push(
            getNextPageContent({
              url: `${pageUrl}${i}`
            })
          );
        }
        debugger;
        nextPageContents = await Promise.all(promises);
      }
      debugger;
      const mergedPagesContent = content + nextPageContents.join('');
      fs.writeFileSync(output, mergedPagesContent);
      debugger;
    } else {
      debugger;
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
