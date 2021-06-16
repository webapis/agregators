
const { fetchPageContent } = require('../../page-collector/pageCollector')
async function pageController({ eventEmitter, batchName, browser, parentUrl, page }) {
  const urlsExist = await page.$$('.image_container a')
  const sideCategoriesExist = await page.$('.side_categories')
  if (urlsExist.length > 0 && sideCategoriesExist) {
    const urls = await page.$$eval('.image_container a', (els) => els.map(e => e.href))
    urls.forEach(url => {
      const nextPagePromise = fetchPageContent({
        url,
        browser,
        eventEmitter,
        pageController,
        parentUrl
      })
      nextPagePromise.batchName = batchName;
      eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: false });
    })
  }
  const nextPageExist = await page.$('.pager a')

  if (nextPageExist && sideCategoriesExist) {
    const nextPageUrl = await page.$eval('.pager a', (el) => el.href)
    const nextPagePromise = fetchPageContent({
      url: nextPageUrl,
      browser,
      eventEmitter,
      pageController
    })
    nextPagePromise.batchName = batchName;
    eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: true });
  }


  
}


const pages = [{ startUrl: 'https://books.toscrape.com/', pageController, batchName: 'books' }]

module.exports = {
  pages
}