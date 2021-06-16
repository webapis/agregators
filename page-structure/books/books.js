
const { fetchPageContent } = require('../../page-collector/pageCollector')
const fs = require('fs')
const makeDir = require('make-dir')
const path = require('path')
async function pageController({ eventEmitter, batchName, browser, parentUrl, page, output }) {
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
        parentUrl,
        output
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
      pageController,
      output
    })
    nextPagePromise.batchName = batchName;
    eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: true });
  }

  const productIdExist = await page.$('#product_description')
  if (productIdExist) {
    const product = await page.evaluate(() => {
      const productDescription = document.querySelector('article.product_page > p').innerHTML
      const UPS = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(1) > td').innerHTML
      const ProductType = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(2) > td').innerHTML
      const PriceTaxExcluded = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(3) > td').innerHTML
      const PriceTaxIncluded = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(4) > td').innerHTML
      const Tax = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(5) > td').innerHTML
      const Availability = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(6) > td').innerHTML
      const Reviews = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(7) > td').innerHTML
      const imageURL = document.querySelector('#product_gallery > div > div > div > img').src
      return { productDescription, UPS, ProductType, PriceTaxExcluded, PriceTaxIncluded, Tax, Availability, Reviews, imageURL }
    })

    let dataObject = [];
    makeDir.sync(path.dirname(output))
    debugger;
    if (fs.existsSync(output)) {
      const data = fs.readFileSync(output, { encoding: 'utf-8' });
      dataObject = JSON.parse(data);
      dataObject.push(product);
    } else {
      dataObject.push(product);
    }
    fs.writeFileSync(output, JSON.stringify(dataObject));
    debugger;
  }
}


const pages = [{ startUrl: 'https://books.toscrape.com/', output: `${process.cwd()}/page-data/books.json`, pageController, batchName: 'books' }]

module.exports = {
  pages
}