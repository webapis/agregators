require('dotenv').config()
const makeDir = require('make-dir')
const fs = require('fs')
const path = require('path')
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
    const colors = el.querySelector('.product-variants__slider') && Array.from(el.querySelector('.product-variants__slider').querySelectorAll('.image-box a')).map(el => { return { link: el.href, color: el.getAttribute('data-title'), image: el.querySelector('img').src } })
    const sizes = el.querySelector('.product-size-selector__buttons') && Array.from(el.querySelector('.product-size-selector__buttons').querySelectorAll('button')).map(m => { if (m.classList.contains('product-no-stock')) { return { size: m.value, available: false } } return { size: m.value, available: true } })
    const productDetail = document.querySelector('.sideMenu__box ul') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML)

    data = { detailPageLink: _url, productName, productCode, prices: { priceNew, priceBasket, priceOld }, images, stock: {}, colors, productDetail, sizes, payment: {}, delivery: {}, returnAndChange: {}, shareAndEarn: {}, reviews: {} }


    return data
  }, url)

}

async function saveData({ data, output, filename }) {
  const outputPath = `${process.cwd()}/page-data/${output}/${filename}`
  debugger
  let dataObject = [];
  makeDir.sync(path.dirname(outputPath))
  if (fs.existsSync(outputPath)) {

    const dataFromFile = fs.readFileSync(outputPath, { encoding: 'utf-8' });
    dataObject = JSON.parse(dataFromFile);
    dataObject.push(data);
  } else {
    dataObject.push(data);
  }
  fs.writeFileSync(outputPath, JSON.stringify(dataObject));

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
      saveData({ data: product, output, filename: "defacto.json" })
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

    let last = 0
    await new Promise((resolve, reject) => {

      var scrollingElement = (document.scrollingElement || document.body);
      const timer = setInterval(() => {
        scrollingElement.scrollTop = scrollingElement.scrollHeight;

        if (scrollingElement.scrollHeight === last) {
          clearInterval(timer)
          resolve()
        } else {
          last = scrollingElement.scrollHeight
        }
      }, 5000);



    });
  });
}




module.exports = {
  saveData,
  defactoPageHandler
}


