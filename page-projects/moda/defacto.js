require('dotenv').config()
const makeDir = require('make-dir')
const fs = require('fs')
const path = require('path')
const { fetchPageContent } = require('../../page-collector/pageCollector');

async function extractPageData({ page }) {

  return await page.$$eval('[data-index]', els => {
    const data = []
    els.forEach(el => {
     const dataDocuments = JSON.parse(el.getAttribute('data-documents'))
      const detailPageLink = el.querySelector('[data-name]').href
     const imageSrc = el.querySelector('[data-srcset]').getAttribute('data-srcset')
     const dataIndex =el.getAttribute('data-index')
     const productName = dataDocuments.ProductName
      const marketPrice = el.querySelector('.product-card__price--new.d-inline-flex') && el.querySelector('.product-card__price--new.d-inline-flex').textContent.trim()
     const salePrice = el.querySelector('.sale.d-inline-flex.align-items-baseline') && el.querySelector('.sale.d-inline-flex.align-items-baseline').textContent.trim()
     const discountInBasket = el.querySelector('.percent.mr-2') && el.querySelector('.percent.mr-2').innerHTML //sepette indirim
      const optsrc = 'https:' + imageSrc.substring(imageSrc.lastIndexOf('//')).replace('3019w', '').replace('3000w', '').trim();
     // data.push({ detailPageLink, productName, price: { salePrice, discountInBasket, marketPrice }, image: { optsrc } })
     data.push({detailPageLink,productName,price: { marketPrice,discountInBasket,salePrice},image: { optsrc } })
    })

    // function removeDuplicates(data, key) {
  
    //   return [
    //     ...new Map(data.map(item => [key(item), item])).values()
    //   ]
    
    // };
    return data
  })

}


async function saveData({ data, output }) {
const limitedData =data.filter((f,i)=> i<5)
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



async function pageController({ eventEmitter, batchName, browser, parentUrl, page, output }) {
  try {
    
 

  const url = await page.url()

  if (!url.includes('page')) {
  

      const totalPages = await page.$eval('.catalog__meta--product-count>span', el => parseInt(el.innerHTML))
      const pageCount = Math.ceil(totalPages / 72);
      
      if (process.env.NODE_ENV === 'test') {

        eventEmitter.emit('totalPages', pageCount)
       
    }
      if (pageCount > 0) {
      
        for (let i = 2; i <= pageCount; i++) {
          // if(i>1){
          //   break;
          // }
          const nextPage = `${url}?lt=v2&page=${i}`
          const nextPagePromise = fetchPageContent({
            url: nextPage,
            browser,
            eventEmitter,
            pageController,
            parentUrl,
            output,
    
          })
          nextPagePromise.batchName = batchName;
          
          eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: false });
        }
      }
 
    


  ;
    await page.waitForSelector('.catalog-products')
    const products = await extractPageData({ page })
 

    await saveData({ data: products, output })
    
  }
  if (url.includes('page')) {
    
    await page.waitForSelector('.catalog-products')
    const products = await extractPageData({ page })

    await saveData({ data: products, output })
 
  }


} catch (error) {
    debugger;
}

}



const pages = [
   { startUrl: 'https://www.defacto.com.tr/kadin-jean-pantolon',output:['page-data/moda/kadın/giyim/alt-giyim/jean-pantolon/defacto.json'], pageController, batchName: 'defacto' },
    { startUrl: 'https://www.defacto.com.tr/erkek-denim-pantolon',output:['page-data/moda/erkek/giyim/alt-giyim/jean-pantolon/defacto.json'], pageController, batchName: 'defacto' },
//  { startUrl: 'https://www.defacto.com.tr/mini-elbise', output: ['page-data/moda/kadın/giyim/elbise/defacto.json'], pageController, batchName: 'defacto' },
]

module.exports = {
  pages,
  saveData,
  pageController
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