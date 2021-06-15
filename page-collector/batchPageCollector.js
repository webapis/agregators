const fs = require('fs');

const { walkSync } = require('./walkSync');
const { firebaseInit } = require('./firebaseInit');
const nodeUrl = require('url');

const puppeteer = require('puppeteer');
const ws_domain = process.env.projectName;
const { promiseConcurrency } = require('./promiseConcurrency');
const {pageCollector}=require('./pageCollector')
async function batchPageCollector({taskSequelizerEventEmitter}) {

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



  //1.Fetch url declared files
  walkSync(`${process.cwd()}/page-structure/${ws_domain}/`, async filepath => {
  
    files.push(filepath);
  });
  const browser = await puppeteer.launch({ headless: false, timeout: 120000 });
  let rejections = [];
  eventEmitter.on('promiseExecComplete', async () => {
    eventEmitter = null;
    console.log('Execution complete');
    database
      .ref(`projects/${process.env.projectName}/pageCollection`)
      .set({ state: 2 });
    await browser.close();
    taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')
  });

  let pageurls = [];
  /* 2. Extract urls from url declared file
        and push it to pageurls array
     */
    debugger;
    for(let file of files){
   
      const {pages} = require(file);

      debugger;
      for(page of pages){
     
        const {dataSelectors,navigationSelectors,pageController,startUrl}=page
    debugger;
      const batchName = nodeUrl
        .parse(startUrl, true)
        .hostname.replace('www.', '')
        .replace('.com.tr', '')
        .replace('.com', '');//?
   
       pageCollector({
       // rejections,
        startUrl,
        output:'/',
        browser,
        eventEmitter,
        batchName,
        pageController,
        dataSelectors,
        navigationSelectors
      });
      
      }
    }

debugger;
  // for (let filepath of files) {
  //   debugger;
  //   const pagePath = filepath.replace('.js', '');
  //   const sourcePages = require(filepath);
  //   sourcePages.forEach(url => {
  //     //3. Extract name of brand from url
  //     const marka = nodeUrl
  //       .parse(url, true)
  //       .hostname.replace('www.', '')
  //       .replace('.com.tr', '')
  //       .replace('.com', '');
  //     //4.Require pageCounter function for domain
  //     const { pageCounter } = require(`./${ws_domain}/${marka}/pageCounter.js`);
  //     //5. Require pageCollection
  //     const { pageCollector } = require('./pageCollector');

  //     //6. Construct output path for fetched page
  //     const output = `${pagePath}/${marka}.html`.replace(
  //       'page-structure',
  //       'page-collection'
  //     );

  //     //7.Start fetching page concurrently
  //     //  concurrency({
  //     //  batchName: marka,
  //     pageCollector({
  //       rejections,
  //       url,
  //       output,
  //       pageCounter,
  //       browser,
  //       counter,
  //       eventEmitter,
  //       marka,
      
  //     });
  //     //});
  //   });
  // }
}

module.exports = {
  batchPageCollector
};
