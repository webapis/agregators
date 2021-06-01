const fs = require('fs');

const { walkSync } = require('./walkSync');

const nodeUrl = require('url');

const puppeteer = require('puppeteer');
const ws_domain = 'tr/moda';
const { promiseConcurrency, eventEmitter } = require('./promiseConcurrency');

async function batchPageCollector() {
  const logPath = `${process.cwd()}/page-result/page-collection-result.json`;
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }

  const files = []; //url files
  promiseConcurrency({
    batchConcurrency: 4,
    totalConcurrency: 10
  });
  console.log('page collection started....');

  //1.Fetch url declared files
  walkSync(`${process.cwd()}/page-structure/${ws_domain}/`, async filepath => {
    files.push(filepath);
  });
  const browser = await puppeteer.launch({ headless: true, timeout: 60000 });
  eventEmitter.on('promiseExecCompleted', async () => {
    await browser.close();
  });
  let totalPagesToScan = 0;
  let counter = 0;
  let pageurls = [];
  /* 2. Extract urls from url declared file
        and push it to pageurls array
     */
  files.map(f => {
    const sourcePages = require(f);

    totalPagesToScan += sourcePages.length;
    sourcePages.forEach(s => {
      pageurls.push(s);
    });
    return sourcePages;
  });

  for (let filepath of files) {
    const pagePath = filepath.replace('.js', '');
    const sourcePages = require(filepath);
    sourcePages.forEach(url => {
      //3. Extract name of brand from url
      const marka = nodeUrl
        .parse(url, true)
        .hostname.replace('www.', '')
        .replace('.com.tr', '')
        .replace('.com', '');
      //4.Require pageCounter function for domain
      const { pageCounter } = require(`./${ws_domain}/${marka}/pageCounter.js`);
      //5. Require pageCollection
      const { pageCollector } = require('./pageCollector');

      //6. Construct output path for fetched page
      const output = `${pagePath}/${marka}.html`.replace(
        'page-structure',
        'page-collection'
      );

      //7.Start fetching page concurrently
      //  concurrency({
      //  batchName: marka,
      pageCollector({
        url,
        output,
        pageCounter,
        browser,
        counter,
        eventEmitter,
        marka,
        cb: async url => {
          if (pageurls.length === 0) {
            console.log('browser is closed');
          }
          counter++;
          console.log(
            'is complete..., totalPagesToScan:',
            totalPagesToScan,
            'counter:',
            counter
          );
          pageurls.splice(pageurls.indexOf(url), 1);
          console.log('total remained:', pageurls.length);
          console.info('urls', pageurls);
        }
      });
      //});
    });
  }
}

module.exports = {
  batchPageCollector
};
