const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const makeDir = require('make-dir');

async function getNextPageContent({ url }) {
  const { window: { document } } = await JSDOM.fromURL(url);
  const content = document.querySelector('.productGrid').innerHTML;

  return content;
}

async function pageCollector({ input, output }) {
  try {
    debugger;
    const { window: { document } } = await JSDOM.fromURL(input);
    const content = document.querySelector('.productGrid').innerHTML;

    const pagesCountString = Array.from(
      document.querySelector('.paging').querySelectorAll('li>a')
    ).map(m => m.innerHTML);
    const pagesCountIntager = Number.parseInt(
      pagesCountString.find((p, i) => i === pagesCountString.length - 2)
    );

    debugger;

    await makeDir(path.dirname(output));
  let nextPageContents=[]
    if (pagesCountIntager > 0) {
      debugger;
      let promises = [];
      for (let i = 1; i <= pagesCountIntager; i++) {
        console.log('Collecting page:',i)
        debugger;
        promises.push(
          getNextPageContent({
          
            url: `https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044?q=%3Arelevance&psize=192&page=${i}`
          })
        );
      }
       nextPageContents = await Promise.all(promises);
     

      debugger;
    }
    const mergedPagesContent = content + nextPageContents;
    // debugger;
    fs.writeFileSync(output, mergedPagesContent);

    debugger;
  } catch (error) {
    debugger;
  }
}

module.exports = {
  pageCollector
};

