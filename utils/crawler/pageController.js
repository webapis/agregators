
const { recordError } = require('../recordError')


function pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData, sync }) {


  return async ({ batchName, id, retries }) => {

    const page = await browser.newPage();
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



      await page.goto(url);
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
