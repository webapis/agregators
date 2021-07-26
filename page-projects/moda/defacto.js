require('dotenv').config()
const makeDir = require('make-dir')
const fs = require('fs')
const path = require('path')
const { recordError } = require('../../utils/recordError')
const { enqueueLink } = require('../../utils/crawler/enqueueLink')
const { requestQueue } = require('../../utils/crawler/requestQueue')
async function extractPageData({ page }) {

  return await page.$eval('.product', el => {
    let data = {}

    // const dataDocuments = JSON.parse(el.getAttribute('data-documents'))
    // const detailPageLink = el.querySelector('[data-name]').href
    // //const imageSrc = el.querySelector('[data-srcset]').getAttribute('data-srcset')
    const productName = el.querySelector('.product-card__name').textContent.trim()
    const productCode = el.querySelector('.product-card__code').textContent.replace('Ürün Kodu:', '')
    

    const priceNew = el.querySelector('.product-card__price--new') && el.querySelector('.product-card__price--new').textContent.trim()
    const priceOld = el.querySelector('.product-card__price--old') && el.querySelector('.product-card__price--old').textContent.trim()
    const priceBasket = el.querySelector('.product-card__price--basket>.sale') && el.querySelector('.product-card__price--basket>.sale').textContent.trim()
    let images = el.querySelectorAll('div.product-card__image-slider--container.swiper-container img') && Array.from(el.querySelectorAll('div.product-card__image-slider--container.swiper-container img')).map(el => el.getAttribute('data-src'))
    const colors = el.querySelector('.product-variants__slider') && Array.from(el.querySelector('.product-variants__slider').querySelectorAll('.image-box a')).map(el => { return { link: el.href, color: el.getAttribute('data-title'), image: el.querySelector('img').src } })
    const sizes =[]
   // el.querySelectorAll('img[data-srcset]').forEach(e => {
    //   srcsets.push(e.getAttribute('data-srcset'))
    // })
    // const placeHolder = document.querySelector('img[data-srcset]').getAttribute('src')
    data = { detailPageLink: '', productName, productCode, prices: { priceNew, priceBasket, priceOld }, images, stock: {}, colors, productDetail: {}, sizes: {}, payment: {}, delivery: {}, returnAndChange: {}, shareAndEarn: {}, reviews: {} }


    // function removeDuplicates(data, key) {

    //   return [
    //     ...new Map(data.map(item => [key(item), item])).values()
    //   ]

    // };

    return data
  })

}

async function extractDetailPageLink({ page }) {

  return await page.$$eval('.image-box > a', els => {
    let data = []
    els.forEach(el => {
      const detailPageLink = `https://defacto.com.tr` + el.getAttribute('href')
      data.push(detailPageLink)
    })

    return data
  })

}

async function saveData({ data, output }) {
  const limitedData = data.filter((f, i) => i < 5)
  for (let i of output) {

    let dataObject = [];
    makeDir.sync(path.dirname(i))

    if (fs.existsSync(i)) {

      const dataFromFile = fs.readFileSync(i, { encoding: 'utf-8' });
      dataObject = JSON.parse(dataFromFile);
      dataObject.push(...limitedData);
    } else {
      dataObject.push(...limitedData);
    }
    fs.writeFileSync(i, JSON.stringify(dataObject));


  }


}



async function defactoPageHandler({ page, userData }) {
  try {



    const url = await page.url()


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






/*

async function extractPageData({ page }) {

  return await page.$$eval('.product-items', els => {
    const data = []
    els.forEach(el => {
      const dataDocuments = JSON.parse(el.querySelector('.products-card').getAttribute('data-documents'))
      const detailPageLink = `https://defacto.com.tr` + el.querySelector('.picture-link').getAttribute('href')
      const imageSrc = el.querySelector('div.picture > a > img').getAttribute('data-srcset')
      const productName = dataDocuments.ProductName
      const salePrice = el.querySelector('.sale-price') && el.querySelector('.sale-price').innerHTML
      const marketPrice = el.querySelector('.market-price') && el.querySelector('.market-price').innerHTML
      const discountInBasket = el.querySelector('.sale > span.percentage') && el.querySelector('.sale > span.percentage').innerHTML //sepette indirim
      const optsrc = 'https:' + imageSrc.substring(imageSrc.lastIndexOf('//')).replace('3000w', '').trim();
      data.push({ detailPageLink, productName, price: { salePrice, discountInBasket, marketPrice }, image: { optsrc } })
    })
    return data;
  })

}
*/