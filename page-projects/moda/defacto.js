require('dotenv').config()
const { saveData } = require('../../utils/crawler/utillty')

const { recordError } = require('../../utils/recordError')
const { enqueueLink } = require('../../utils/crawler/enqueueLink')
async function extractPageData({ page }) {
  const url = await page.url()
  return await page.$eval('.product', (el, _url) => {
    let data = {}

    const productName = el.querySelector('.product-card__name').textContent.trim()
    const productCode = el.querySelector('.product-card__code').textContent.replace('Ürün Kodu:', '')
    const priceNew = el.querySelector('.product-card__price--new') && el.querySelector('.product-card__price--new').textContent.trim()
    const priceOld = el.querySelector('.product-card__price--old') && el.querySelector('.product-card__price--old').textContent.trim()
    const priceBasket = el.querySelector('.product-card__price--basket>.sale') && el.querySelector('.product-card__price--basket>.sale').textContent.trim()
    let images = el.querySelectorAll('div.product-card__image-slider--container.swiper-container img') && Array.from(el.querySelectorAll('div.product-card__image-slider--container.swiper-container img')).map(el => el.getAttribute('data-src'))
    const otherColors = el.querySelector('.product-variants__slider') && Array.from(document.querySelector('.product-variants__slider').querySelectorAll('.image-box a')).map(el => el.href)
    const sizes = el.querySelector('.product-size-selector__buttons') && Array.from(el.querySelector('.product-size-selector__buttons').querySelectorAll('button')).map(m => { if (m.classList.contains('product-no-stock')) { return { size: m.value, available: false } } return { size: m.value, available: true } })
    const color = document.querySelector('.sideMenu__box ul').querySelectorAll('li') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML).find(f => f.includes("Renk :"))
    const material = document.querySelector('.sideMenu__box ul').querySelectorAll('li') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML).find((f, i) => i === 2).trim()
    const modelDetail = document.querySelector('.sideMenu__box ul').querySelectorAll('li') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML).find((f, i) => i === 0).trim()
    data = { detailPageLink: _url, productName, productCode, prices: { priceNew, priceBasket, priceOld }, images, stock: {}, otherColors, productDetail: { color: color.substring(color.indexOf(':') + 1).trim(), material, modelDetail: modelDetail.substring(modelDetail.indexOf(':') + 1).trim() }, sizes }
    return data
  }, url)
}




async function defactoPageHandler({ page, userData }) {
  try {
    const { output } = userData

    //initial list page
    const catalogProducts = await page.$('.catalog-products')

    if (catalogProducts) {
      await autoScroll(page)
      await page.waitForSelector('.catalog-products')
      await enqueueLink({ selector: '.catalog-products .image-box > a', page, userData })
    }
    //productDetail
    const productDetail = await page.$('.product')
    if (productDetail) {

      const product = await extractPageData({ page })
      debugger;
      const { otherColors } = product
      if (otherColors && otherColors.length > 0) {
        let promises = []
        otherColors.forEach(url => {
          promises.push(fetchOtherColorPages({ url }))
        })
        const fetchedOtherColors = await Promise.all(promises)
        const productWithOtherColors = { ...product, otherColors: fetchedOtherColors }
        debugger;
        const urlsToRetry = findFailedUlrs({ fetchedUrls: fetchedOtherColors, sourceUrls: otherColors })
        if (urlsToRetry.length > 0) {
          debugger;
          let retryPromises = []
          urlsToRetry.forEach(url => {
            retryPromises.push(fetchOtherColorPages({ url }))
          })

          const retriedOtherColors = await Promise.all(retryPromises)
          const productWithRetriedOtherColors = { ...productWithOtherColors, otherColors: { ...productWithOtherColors.otherColors, retriedOtherColors } }
          saveData({ data: productWithRetriedOtherColors, output, filename: "defacto.json" })
        } else {
          debugger;
          saveData({ data: productWithOtherColors, output, filename: "defacto.json" })
        }
        debugger;

      } else {
        saveData({ data: product, output, filename: "defacto.json" })
      }
      debugger;


    }

  } catch (error) {
    debugger;
    recordError({ batchName: 'defacto', functionName: 'defactoPageHandler', dirName: 'page-collection-errors' })
    debugger;
  }

}
async function autoScroll(page) {
  await page.evaluate(async () => {
    const total = parseInt(document.querySelector('.catalog__meta--product-count>span').textContent)
    let last = 0
    await new Promise((resolve, reject) => {

      var scrollingElement = (document.scrollingElement || document.body);
      const timer = setInterval(async () => {
        window.focus()
        scrollingElement.scrollTop = scrollingElement.scrollHeight;

        if (document.querySelectorAll('.catalog-products .image-box > a').length === total) {
          clearInterval(timer)
          resolve()
        } else {
          last = scrollingElement.scrollHeight
        }
      }, 5000);



    });
  });
}
function findFailedUlrs({ fetchedUrls, sourceUrls }) {
  const successFullFetchedUrls = fetchedUrls.filter(f => f !== null)
  const urlsToRetrie = sourceUrls.filter(s => successFullFetchedUrls.indexOf(s) !== -1)
  debugger;
  return urlsToRetrie
}

async function fetchOtherColorPages({ url }) {
  const page = await global.browser.newPage()
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
    await page.goto(url)

    await page.waitForSelector('.product')

    const data = await extractPageData({ page })
    await page.close()
    debugger;
    return data
  } catch (error) {
    debugger;
    recordError({ batchName: 'defacto', functionName: 'fetchOtherColorPages', dirName: 'page-collection-errors' })
    await page.close()

  }

}



module.exports = {

  defactoPageHandler
}


