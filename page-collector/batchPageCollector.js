const fs = require('fs');

const { walkSync } = require('./walkSync');
const { firebaseInit } = require('./firebaseInit');

const puppeteer = require('puppeteer');
const ws_domain = process.env.projectName;
const { promiseConcurrency } = require('./promiseConcurrency');
const { fetchPageContent } = require('./pageCollector')
async function batchPageCollector({ taskSequelizerEventEmitter }) {
  let pageurls = [];
  const { database } = firebaseInit();
  database.ref(`projects/${process.env.projectName}/pageCollection`).set({
    state: 1
  });
  const logPath = `${process.cwd()}/page-result/page-collection-result.json`;
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }

  const files = []; //url files
  let eventEmitter = promiseConcurrency({
    batchConcurrency: 6,
    totalConcurrency: 12
  });
  // eventEmitter.on('urls_queued', (data) => {
  //   debugger;
  //   const { pageController, urls, batchName } = data
  //   debugger;
  //   urls.forEach(url => {
  //     debugger;
  //     const nextPagePromise = fetchPageContent({
  //       url,
  //       browser,
  //       eventEmitter,
  //       pageController
  //     })
  //     firstPagePromise.batchName = batchName;
  //     debugger;
  //     eventEmitter.emit('promiseAttached', nextPagePromise);
  //   })

  // })
  //1.Fetch url declared files
  walkSync(`${process.cwd()}/page-structure/${ws_domain}/`, async filepath => {

    files.push(filepath);
  });
  const browser = await puppeteer.launch({ headless: false, timeout: 120000 });
  eventEmitter.on('promiseExecComplete', async () => {
    eventEmitter = null;
    console.log('Execution complete');
    database
      .ref(`projects/${process.env.projectName}/pageCollection`)
      .set({ state: 2 });
    await browser.close();
    taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')
  });


  /* 2. Extract urls from url declared file
        and push it to pageurls array
     */

  for (let file of files) {

    const { pages } = require(file);
    for (page of pages) {
      const { pageController, startUrl, batchName } = page
      const firstPagePromise = fetchPageContent({
        url: startUrl,
        browser,
        eventEmitter,
        pageController
      })
      firstPagePromise.batchName = batchName;
      eventEmitter.emit('promiseAttached', { promise: firstPagePromise, unshift: false });

    }
  }

}

module.exports = {
  batchPageCollector
};
