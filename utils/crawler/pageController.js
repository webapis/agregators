
const { recordError } = require('../recordError')


function pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData, sync }) {


  return async ({ batchName, id, retries }) => {

    const page = await browser.newPage();

    // await page.setViewport({
    //     width: 2554,
    //     height: 2302,
    //     deviceScaleFactor: 1,
    // });
    try {

      await page.setRequestInterception(true);
      page.on('request', req => {
        const resourceType = req.resourceType();
        if (resourceType === 'image') {


          req.respond({
            status: 200,
            contentType: 'image/jpeg',
            body: ''
          });


        } else {
          req.continue();
        }
      });
      if (retries === undefined) {
        throw 'retries is undefined'
      }

      const timeout = retries === 0 ? 30000 : retries * 30000

      await page.goto(url, { waitUntil: 'networkidle0', timeout });
     
      postNavHook && await postNavHook({ page })




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
        console.log("pageController ERROR.....:", error)
        recordError({ batchName, error: { error, url }, functionName: 'pageController', dirName: 'page-collection-errors' })
      }
    }
  };
}




module.exports = { pageController };
