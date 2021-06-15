const makeDir = require('make-dir');
const pather = require('path');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const { uuidv4 } = require('./uuidv4');
function fetchPageContent({ url, browser, eventEmitter, dataSelectors,
  navigationSelectors, pageController }) {

  return async ({ uuidv4, batchName, promiseName, id }) => {
    const page = await browser.newPage();
    try {
      await page.setRequestInterception(true);
      page.on('request', req => {
        const resourceType = req.resourceType();

        if (
          resourceType === 'document' ||
          resourceType === 'stylesheet' ||
          resourceType === 'script'
        ) {
          req.continue();
        } else {
          req.abort();
        }
      });
    
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
      //  await page.waitForSelector('body', { timeout: 120000 });
      // const content = await page.$eval(selector, elem => elem.innerHTML);
      let dataElements = []
   
      const content = await page.content()
      const { window: { document } } = new JSDOM(content);
      for (let selector of dataSelectors) {
      
        const elements = document.querySelectorAll(selector)
       
        if (elements) {
          dataElements.push({ selector, elements })
        }
      

      }
      let navElements = []
      for (let selector of navigationSelectors) {
        debugger;

        const elements = document.querySelectorAll(selector)
        const elementHref =Array.from(elements).map(e=>e.href)
        debugger;
        if (elements) {
          navElements.push(...elementHref)
        }
        debugger;

      }
      pageController({
        dataElements,
        navigationElements:navElements,
         eventEmitter
      })
      eventEmitter.emit('promiseResolved', {
        uuidv4,
        batchName,
        promiseName,
        //   content,
        page,
        id
      });
    } catch (error) {
      debugger;
      eventEmitter.emit('promiseRejected', {
        url,
        error,
        batchName,
        promiseName,
        page,
        uuidv4,
        id
      });
    }
  };
}
/*
      startUrl,
        output,
        browser,
        eventEmitter,
        batchName,
        pageController,
        interestSelectors
*/
async function pageCollector({
  startUrl,
  pageController,
  dataSelectors,
  navigationSelectors,
  output,
  //url,
  browser,
  // pageCounter,
  eventEmitter,
  batchName
  // rejections
}) {
  // let pageContents = [];
  // const { selector, countPages } = pageCounter();

  let localUidv4 = uuidv4();

  // eventEmitter.on('promiseRejected', async resolvedPromise => {
  //   const { id } = resolvedPromise;

  //   if (rejections.length === 0) {
  //     rejections.push(resolvedPromise);

  //     recordError(resolvedPromise);
  //   } else {
  //     const findError = rejections.find(f => f.id === id);

  //     if (findError === undefined) {
  //       rejections.push(resolvedPromise);

  //       recordError(resolvedPromise);
  //     }
  //   }

  // });
  // eventEmitter.on('promiseResolved', async resolvedPromise => {
  //   const { uuidv4, batchName, promiseName, content, page } = resolvedPromise;
  // if (
  //   promiseName === 'firstPage' &&
  //   batchName === marka &&
  //   uuidv4 === localUidv4
  // ) {
  // const { pageCount, nextPageUrl } = await countPages({
  //   page,
  //   url
  // });
  // await page.close();
  // pageContents += content;

  // if (pageCount > 0) {
  //   for (let i = 1; i <= pageCount; i++) {
  //     let nextPagePromise = fetchPageContent({
  //       url: `${nextPageUrl}${i}`,
  //       browser,
  //       selector,
  //       eventEmitter
  //     });
  //     nextPagePromise.uuidv4 = localUidv4;
  //     nextPagePromise.batchName = marka;
  //     nextPagePromise.output = output;
  //     if (pageCount === i) {
  //       nextPagePromise.promiseName = 'lastPage';
  //     } else {
  //       nextPagePromise.promiseName = 'nextPage';
  //     }

  //     eventEmitter.emit('promiseAttached', nextPagePromise);
  //   }
  // }
  // }
  //   if (
  //     promiseName === 'nextPage' &&
  //     batchName === marka &&
  //     uuidv4 === localUidv4
  //   ) {
  //     const { content, page } = resolvedPromise;
  //     pageContents += content;
  //     await page.close();
  //   }
  //   if (
  //     promiseName === 'lastPage' &&
  //     batchName === marka &&
  //     uuidv4 === localUidv4
  //   ) {
  //     const { content, page } = resolvedPromise;
  //     pageContents += content;
  //     await makeDir(pather.dirname(output));
  //     fs.writeFileSync(output, pageContents);
  //     await page.close();
  //   }
  // });

  let firstPagePromise = fetchPageContent({
    url: startUrl,
    browser,
    dataSelectors,
    navigationSelectors,
    eventEmitter,
    pageController,
  });
  firstPagePromise.uuidv4 = localUidv4;
  firstPagePromise.batchName = batchName;
  //firstPagePromise.promiseName = 'firstPage';
  // firstPagePromise.output = output;
  eventEmitter.emit('promiseAttached', firstPagePromise);
}

async function recordError(promise) {
  const { page, error, batchName, promiseName, url, id } = promise;
  const { message, name } = error;

  const result = {
    id,
    errorMessage: message,
    errorName: name,
    url,
    batchName,
    pageTitle: page && (await page.title()),
    promiseName,
    dateTime: Date.now()
  };
  let filePath = `${process.cwd()}/page-result/page-collection-result.json`;
  let dataObject = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    dataObject = JSON.parse(data);
    dataObject.push(result);
  } else {
    dataObject.push(result);
  }
  fs.writeFileSync(filePath, JSON.stringify(dataObject));
}
module.exports = { pageCollector };
