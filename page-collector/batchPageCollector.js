const fs = require('fs');

const { walkSync } = require('./walkSync');

const puppeteer = require('puppeteer');
const { promiseConcurrency } = require('../utils/promise-concurrency');
const { pageController } = require('../utils/crawler/pageController')
async function batchPageCollector({ taskSequelizerEventEmitter }) {
  global.dataCollected = 0


  const logPath = `${process.cwd()}/page-result/page-collection-result.json`;
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }

  const files = []; //url files
  let eventEmitter = promiseConcurrency({
    batchConcurrency: 3, rejectedRetry: 3,
    taskName: 'dataCollection'
  });

  //1.Fetch url declared files
  walkSync(`${process.cwd()}/page-projects/${process.env.projectName}`, async filepath => {

    files.push(filepath);
  });
  const browser = await puppeteer.launch({ headless: false, timeout: 120000 });
  global.browser = browser

  eventEmitter.on('promiseExecComplete', async () => {

    eventEmitter = null;
    await browser.close();
    taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')


  });


  /* 2. Extract urls from url declared file
        and push it to pageurls array
     */

  // for (let file of files) {

  //   const { pages } = require(file);

  //   for (page of pages) {
  //     const { pageController, startUrl, batchName, output } = page
  //     debugger;
  //     const firstPagePromise = pageController({
  //       url: startUrl,
  //       browser,
  //       eventEmitter,
  //       pageController,
  //       output,
  //     })
  //     firstPagePromise.batchName = batchName;
  //     if (fs.existsSync(output)) {

  //       fs.unlinkSync(output)

  //     }
  //     eventEmitter.emit('promiseAttached', { promise: firstPagePromise, unshift: false });
  //   }
  // }

}

module.exports = {
  batchPageCollector
};
