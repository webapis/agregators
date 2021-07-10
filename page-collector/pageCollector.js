
const fs = require('fs');
const { URL } =require('url');
function fetchPageContent({ url, browser, eventEmitter, pageController,parentUrl,output }) {

  return async ({ batchName, id }) => {
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
      const title =await page.title()
      if(title.includes('404')|| url.includes('..')){
        const pUrl =parentUrl
        
      }
      const host =await page.url()
      const origin = new URL(host).origin;

      const content = await page.content()

     await pageController({
        origin,
        eventEmitter,
        batchName,
        content,
        browser,
        parentUrl:host,
        page,
        output,
        id
      
      })
     
      eventEmitter.emit('promiseResolved', {
        batchName,
        id
      });
      await page.close()
    } catch (error) {
      
      eventEmitter.emit('promiseRejected', {
        url,
        error,
        batchName,
        id
      });
      await page.close()
    }
  };
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
module.exports = { fetchPageContent };
