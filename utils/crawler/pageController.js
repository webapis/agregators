
const { recordError } = require('../recordError')
const { fb_steps } = require('../firebase/firebaseEventEmitter')
const fs = require('fs')
const { URL } = require('url');
function pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData, sync }) {


  return async ({ batchName, id, retries }) => {

    const page = await browser.newPage();
    try {
      // preNavHook && await preNavHook({ page })
      await page.setRequestInterception(true);
      page.on('request', req => {
        const resourceType = req.resourceType();
       if (resourceType === 'image') {
        
       
          req.respond({
            status: 200,
            contentType: 'image/jpeg',
            body: ''
          });
        
          // req.abort();
        } else {
          req.continue();
        }
      });
      if (retries === undefined) {
        throw 'retries is undefined'
      }

      const timeout = retries === 0 ? 30000 : 30000 * retries

      
      // waitUntil: 'networkidle0'
      //await page.goto(url, { waitUntil: 'networkidle0', timeout });
      await page.goto(url);
      postNavHook && await postNavHook({ page })
      const host = await page.url()

      //const origin = new URL(host).origin;
      //       if (host !== url) {
      // debugger;
      //         const nextPagePromise = pageController({
      //           url,
      //           browser,
      //           eventEmitter,
      //           handlePageFunction,
      //           userData,
      //           sync
      //         })
      //         nextPagePromise.batchName = batchName;
      //         nextPagePromise.retries = retries
      //         nextPagePromise.id = id
      //         nextPagePromise.url = url
      //         nextPagePromise.sync
      //         await page.close()
      //         eventEmitter.emit('retryPromise', { promise: nextPagePromise, unshift: true });


      //       }

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
debugger;
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
        debugger;
        console.log('retries errrr', retries)
        console.log("pageController ERROR.....:", error)
        recordError({ batchName, error: { error, url }, functionName: 'pageController', dirName: 'page-collection-errors' })
      }
    }
  };
}




module.exports = { pageController };
