const makeDir = require('make-dir');
const pather = require('path');
const fs = require('fs');
const { uuidv4 } = require('./uuidv4');
function fetchPageContent({ url, browser, selector, eventEmitter }) {
  return async ({ uuidv4, batchName, promiseName }) => {
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

      await page.goto(url, { waitUntil: 'domcontentloaded'});
      await page.waitForSelector(selector);
      const content = await page.$eval(selector, elem => elem.innerHTML);

      eventEmitter.emit('promiseResolved', {
        uuidv4,
        batchName,
        promiseName,
        content,
        page
      });
    } catch (error) {
      eventEmitter.emit('promiseRejected', { url, error, batchName, uuidv4 });
    }
  };
}

async function pageCollector({
  output,
  url,
  browser,
  pageCounter,
  cb,
  eventEmitter,
  marka
}) {
  let pageContents = [];
  const { selector, countPages } = pageCounter();

  let localUidv4 = uuidv4();
  eventEmitter.on('promiseResolved', async resolvedPromise => {
    const { uuidv4, batchName, promiseName, content, page } = resolvedPromise;
    if (
      promiseName === 'firstPage' &&
      batchName === marka &&
      uuidv4 === localUidv4
    ) {
      const { pageCount, nextPageUrl } = await countPages({
        page,
        url
      });
      await page.close();
      pageContents += content;

      if (pageCount > 0) {
        for (let i = 1; i <= pageCount; i++) {
          let nextPagePromise = fetchPageContent({
            url: `${nextPageUrl}${i}`,
            browser,
            selector,
            eventEmitter
          });
          nextPagePromise.uuidv4 = localUidv4;
          nextPagePromise.batchName = marka;
          if (pageCount === i) {
            nextPagePromise.promiseName = 'lastPage';
          } else {
            nextPagePromise.promiseName = 'nextPage';
          }

          eventEmitter.emit('promiseAttached', nextPagePromise);
        }
      }
    }
    if (
      promiseName === 'nextPage' &&
      batchName === marka &&
      uuidv4 === localUidv4
    ) {
      const { content, page } = resolvedPromise;
      pageContents += content;
      await page.close();
    }
    if (
      promiseName === 'lastPage' &&
      batchName === marka &&
      uuidv4 === localUidv4
    ) {
      const { content, page } = resolvedPromise;
      pageContents += content;
      await makeDir(pather.dirname(output));
      fs.writeFileSync(output, pageContents);
      await page.close();
    }
  });

  let firstPagePromise = fetchPageContent({
    url,
    browser,
    selector,
    eventEmitter
  });
  firstPagePromise.uuidv4 = localUidv4;
  firstPagePromise.batchName = marka;
  firstPagePromise.promiseName = 'firstPage';
  eventEmitter.emit('promiseAttached', firstPagePromise);
}

module.exports = { pageCollector };

/*
const makeDir = require('make-dir');
const pather = require('path');
const fs = require('fs');
async function getNextPageContent({ url, page, selector }) {
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

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.waitForSelector(selector, { timeout: 0 });
    const content = await page.$eval(selector, elem => elem.innerHTML);
    await page.close();
    return content;
  } catch (error) {
    console.log('getNextPageContent url:', url);
    console.log('getNextPageContent url error:>>>>>', error);
  }
}

function pageCollector({ output, url, browser, pageCounter,cb }) {
  return async () => {
    try {
      const { selector, countPages } = pageCounter();

      await makeDir(pather.dirname(output));

      const page = await browser.newPage();
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

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      await page.waitForSelector(selector, { timeout: 0 });

      const firstPageContent = await page.$eval(
        selector,
        elem => elem.innerHTML
      );
      const { pageCount, nextPageUrl } = await countPages({
        page,
        url
      });

      let nextPageContents = [];
      if (pageCount > 0) {
        let promises = [];
        for (let i = 1; i <= pageCount; i++) {
          //console.log('Collecting page:', i, `${nextPageUrl}${i}`);

          promises.push(
            await getNextPageContent({
              url: `${nextPageUrl}${i}`,
              page: await browser.newPage(),
              selector
            })
          );
        }

        nextPageContents = await Promise.all(promises);

        const joinContent = [firstPageContent, ...nextPageContents].join(' ');

        await page.close();
        cb(url)
     
        fs.writeFileSync(output, joinContent);
      } else {
        cb(url)
        await page.close();
      
        fs.writeFileSync(output, firstPageContent);
      }
    } catch (error) {
      console.log('pageCollector url:', url);
      console.log('pageCollector url error:>>>>>', error);
    }
  };
}

module.exports = { pageCollector };
*/
