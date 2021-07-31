
const { recordError } = require('../recordError')
const { fb_steps } = require('../firebase/firebaseEventEmitter')
const { URL } = require('url');
function pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData,sync }) {


  return async ({ batchName, id, retries }) => {

    const page = await browser.newPage();
    try {
      //  await preNavHook({ page })

      if (retries === undefined) {
        throw 'retries is undefined'
      }
      //await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 200000 });
      const timeout = retries === 0 ? 30000 : 30000 * retries

      await page.goto(url, {waitUntil:'networkidle0', timeout });
      //await postNavHook({ page })
      const host = await page.url()
      
      const origin = new URL(host).origin;
      if (host !== url) {

        const nextPagePromise = pageController({
          url,
          browser,
          eventEmitter,
          handlePageFunction,
          userData,
          sync
        })
        nextPagePromise.batchName = batchName;
        nextPagePromise.retries = retries
        nextPagePromise.id = id
        nextPagePromise.url = url
        nextPagePromise.sync
        await page.close()
        eventEmitter.emit('retryPromise', { promise: nextPagePromise, unshift: true });

      
      }

      await handlePageFunction({
        page,
        userData
      })
      await page.close()
      eventEmitter.emit('promiseResolved', {
        batchName,
        id
      });

 
    } catch (error) {

      const { name } = error
      
      if (name === 'TimeoutError') {
        
        const nextPagePromise = pageController({
          url,
          browser,
          eventEmitter,
          handlePageFunction,
          userData,
          sync
        })
        nextPagePromise.batchName = batchName;
        nextPagePromise.retries = retries
        nextPagePromise.id = id
        nextPagePromise.url = url
        nextPagePromise.sync
        await page.close()
        eventEmitter.emit('retryPromise', { promise: nextPagePromise, unshift: true });
     
      } else {
        console.log('retries errrr', retries)
        console.log("pageController ERROR.....:", error)
        recordError({ batchName, error: { error, url }, functionName: 'pageController', dirName: 'page-collection-errors' })
      }

      
      // recordError({ batchName, error: { error, url }, functionName: 'fetchPageContent', dirName: 'page-collection-errors' })
      // global.fb_eventEmitter.emit(fb_steps.DATA_COLLECTION_FAILED)
    }
  };
}




module.exports = { pageController };
