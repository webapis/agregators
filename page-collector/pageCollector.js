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

 function pageCollector({ output, url, browser, pageCounter }) {
  return async () => {
    try {
      debugger;
      const { selector, countPages } = pageCounter();
      debugger;

      await makeDir(pather.dirname(output));

      const page = await browser.newPage();
      await page.setRequestInterception(true);
      debugger;
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
        debugger;
        let promises = [];
        for (let i = 1; i <= pageCount; i++) {
          console.log('Collecting page:', i, `${nextPageUrl}${i}`);

          promises.push(
            getNextPageContent({
              url: `${nextPageUrl}${i}`,
              page: await browser.newPage(),
              selector
            })
          );
        }
      
        nextPageContents = await Promise.all(promises);
        const joinContent = [firstPageContent, ...nextPageContents].join(' ');
     
        await page.close();
        fs.writeFileSync(output, joinContent);
      } else {
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
