require('dotenv').config()
const { saveData } = require('../../utils/crawler/utillty')

const { recordError } = require('../../utils/recordError')
const { enqueueLink } = require('../../utils/crawler/enqueueLink')
const { requestQueue } = require('../../utils/crawler/requestQueue')
async function extractPageData({ page }) {
  const url = await page.url()
  const book = await page.evaluate(() => {
    const productDescription = document.querySelector('article.product_page > p').innerHTML
    const category = Array.from(document.querySelector('.breadcrumb').querySelectorAll('li a'))[2].innerHTML.trim()
    const UPS = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(1) > td').innerHTML
    const ProductType = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(2) > td').innerHTML
    const PriceTaxExcluded = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(3) > td').innerHTML
    const PriceTaxIncluded = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(4) > td').innerHTML
    const Tax = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(5) > td').innerHTML
    const Availability = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(6) > td').innerHTML
    const Reviews = document.querySelector('#content_inner > article > table > tbody > tr:nth-child(7) > td').innerHTML
    const imageURL = document.querySelector('#product_gallery > div > div > div > img').src

    return { productDescription, category, UPS, ProductType, PriceTaxExcluded, PriceTaxIncluded, Tax, Availability, Reviews, imageURL }
  })
  return { ...book, url };

}




async function handlePageFunction({ page, userData }) {
  
  await page.waitForSelector('.default')
  const { output } = userData
  const url = await page.url()
  const sideBar = await page.$('.sidebar')

  if (!url.includes('page-') && sideBar) {
    const hasPagination = await page.$('.pager')
    if (hasPagination) {

      const totalPages = await page.evaluate(() => {
        const pager = Array.from(document.querySelector('.pager').querySelectorAll('li')).filter(f => f.classList.contains('current')).map(m => m.textContent.trim())
        return parseInt(pager[0].substring(pager[0].indexOf('of') + 2).trim())
      })



      for (let i = 2; i <= totalPages; i++) {
        const nextPageUrl = `https://books.toscrape.com/catalogue/category/books_1/page-${i}.html`
        requestQueue.push({ url: nextPageUrl, userData })
      }

    }

  }

  if (sideBar) {
    await enqueueLink({ selector: '.image_container a', page, userData })

  }

  const productDetailImageContainer = await page.$('#product_description')

  if (productDetailImageContainer) {
    const product = await extractPageData({ page })

    saveData({ data: product, output, filename: 'books.json' })

  }

}







// async function fetchOtherColorPages({ url }) {
//   const page = await global.browser.newPage()
//   try {
//     await page.setRequestInterception(true);
//     page.on('request', req => {
//       const resourceType = req.resourceType();
//       if (
//         resourceType === 'document' ||
//         resourceType === 'stylesheet' ||
//         resourceType === 'script'
//       ) {
//         req.continue();
//       } else {
//         req.abort();
//       }
//     });
//     await page.goto(url)
//     await page.waitForSelector('.productDetailImageContainer')
//     const data = await extractPageData({ page })

//     return data
//   } catch (error) {

//     recordError({ batchName: 'koton', functionName: 'fetchOtherColorPages', dirName: 'page-collection-errors' })
//     await page.close()
//   }

// }




module.exports = {

  handlePageFunction
}





/*

const { fetchPageContent } = require('../../page-collector/pageCollector')
const fs = require('fs')
const makeDir = require('make-dir')
const path = require('path')
var json2xls = require('json2xls');
async function pageController({ eventEmitter, batchName, browser, parentUrl, page, output }) {
  const urlsExist = await page.$$('.image_container a')
  const sideCategoriesExist = await page.$('.side_categories')
  if (urlsExist.length > 0 && sideCategoriesExist) {
    const urls = await page.$$eval('.image_container a', (els) => els.map(e => e.href))
    //urls.filter((f,i)=>i<10).forEach(url => {
    urls.forEach(url => {
      const nextPagePromise = fetchPageContent({
        url,
        browser,
        eventEmitter,
        pageController,
        parentUrl,
        output,

      })
      nextPagePromise.batchName = batchName;

      eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: false });
    })
  }
  const nextPageExist = await page.$('.pager a')

  if (nextPageExist && sideCategoriesExist  && false) {
    const nextPageUrl = await page.$eval('.pager a', (el) => el.href)
    const nextPagePromise = fetchPageContent({
      url: nextPageUrl,
      browser,
      eventEmitter,
      pageController,
      output,

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

    if (fs.existsSync(output)) {
      const data = fs.readFileSync(output, { encoding: 'utf-8' });
      dataObject = JSON.parse(data);
      dataObject.push(product);
    } else {
      dataObject.push(product);
    }
    fs.writeFileSync(output, JSON.stringify(dataObject));
    var xls = json2xls(dataObject);
    const excelFolder =path.dirname(output)+'/excel/'
    const excellFileName =path.basename(output).replace('.json','')+'.xlsx'
    const excelloutput=excelFolder+excellFileName
    makeDir.sync( path.dirname(excelloutput))
    console.log('excelloutput',excelloutput)

    fs.writeFileSync(excelloutput, xls,'binary');
    eventEmitter.emit('data_collected')
    // if(uploadFile){
    //   fileUploader({})

    // }

  }
}


const pages = [{ startUrl: 'https://books.toscrape.com/', pageController, batchName: 'books' }]

module.exports = {
  pages
}
*/