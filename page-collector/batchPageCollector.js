const fs = require('fs');

const { walkSync } = require('./walkSync');
const { firebaseInit } = require('./firebaseInit');

const puppeteer = require('puppeteer');
const { fileUploader } = require('./fileUploader')
const ws_domain = process.env.projectName;
const { promiseConcurrency } = require('./promiseConcurrency');
const { fetchPageContent } = require('./pageCollector')
async function batchPageCollector({ taskSequelizerEventEmitter, output, uploadFile }) {
  let dataCollected = 0
  const { database } = firebaseInit();
  database.ref(`projects/${process.env.projectName}`).update({
    dataCollection: 3
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

  //1.Fetch url declared files
  walkSync(`${process.cwd()}/page-structure/${ws_domain}/`, async filepath => {

    files.push(filepath);
  });
  const browser = await puppeteer.launch({ headless: true, timeout: 120000 });
  eventEmitter.on('data_collected', () => {
    console.log('data_collected....')
    debugger;
    dataCollected ++;

  })

  let lastDataCollected=0
  setInterval(()=>{
    const collectedFromTheLastTime =dataCollected-lastDataCollected
  //  if(dataCollected> lastDataCollected && collectedFromTheLastTime>=3){

      database.ref(`projects/${process.env.projectName}`).update({
        dataCollected
      });
   // }
  },300)

  eventEmitter.on('no_more_task', function () {
    console.log('ALL TASKS COMPLETE')
    process.exit(0)
  })
  eventEmitter.on('promiseExecComplete', async () => {
    eventEmitter = null;
    console.log('Execution complete');
    database
      .ref(`projects/${process.env.projectName}`)
      .update({ dataCollection: 4 });
    await browser.close();
    if (uploadFile) {
      fileUploader({
        database,
        output, cb: () => {
          taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')
        }
      })
    } else {
      taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')
    }

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
        pageController,
        output
      })
      firstPagePromise.batchName = batchName;

      eventEmitter.emit('promiseAttached', { promise: firstPagePromise, unshift: false });
    }
  }

}

module.exports = {
  batchPageCollector
};
