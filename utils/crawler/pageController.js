
const { recordError } = require('../recordError')
const { URL } = require('url');
function pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData }) {

  return async ({ batchName, id, retries }) => {

    const page = await browser.newPage();
    try {
      await preNavHook({ page })


      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 200000 });
      await postNavHook({ page })
      const host = await page.url()
      const origin = new URL(host).origin;
      if (host !== url) {
      
        const nextPagePromise = pageController({
          url,
          browser,
          eventEmitter,
          handlePageFunction,
          userData
        })
        nextPagePromise.batchName = batchName;
        nextPagePromise.retries = retries
        nextPagePromise.id = id
       
        eventEmitter.emit('retryPromise', { promise: nextPagePromise, unshift: false });
    
        await page.close()
      }

      await handlePageFunction({
        page,
        userData
      })
      eventEmitter.emit('promiseResolved', {
        batchName,
        id
      });
   
      await page.close()
    } catch (error) {
      console.log(error)
      debugger;
      recordError({ batchName, error: { error, url }, functionName: 'fetchPageContent', dirName: 'page-collection-errors' })
    }
  };
}




module.exports = { pageController };
