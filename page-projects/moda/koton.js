require('dotenv').config()
const {recordError}=require('../../utils/recordError')
const { fetchPageContent } = require('../../page-collector/pageCollector');
const {saveData}=require('./defacto')
async function extractPageData({ page }) {


      return await page.$$eval('.product-item', els => {
        const data = []
          els.forEach(el => {
          const detailPageLink =el.querySelector('figure > a') && el.querySelector('figure > a').href
          const imageSrc =el.querySelector(".swiper-lazy") &&  el.querySelector(".swiper-lazy").getAttribute('data-src')       
          const productName = el.getAttribute('data-name')
          const marketPrice = el.querySelector(".firstPrice") ? el.querySelector(".firstPrice").innerText : el.querySelector(".insteadPrice") && el.querySelector(".insteadPrice").innerText 
          const salePrice = el.querySelector(".insteadPrice") ? el.querySelector(".newPrice").innerText :null
           const discountInBasket = el.querySelector(".insteadPrice") ?  el.querySelector(".product-badge").innerText:null
          //   const optsrc = 'https:' + imageSrc.substring(imageSrc.lastIndexOf('//')).replace('3019w', '').replace('3000w', '').trim();
          // data.push({detailPageLink,productName,price: { marketPrice,discountInBasket,salePrice},image: { optsrc },dataIndex })
          data.push({detailPageLink,productName,price: { marketPrice,salePrice,discountInBasket},image: { optsrc: imageSrc} })
        })
        return data
      })

}


// async function saveData({ data, output }) {
//     const limitedData = data.filter((f, i) => i < 5)
//     for (let i of output) {

//         let dataObject = [];
//         makeDir.sync(path.dirname(i))

//         if (fs.existsSync(i)) {
//             const dataFromFile = fs.readFileSync(i, { encoding: 'utf-8' });
//             dataObject = JSON.parse(dataFromFile);
//             dataObject.push(...limitedData);
//         } else {
//             dataObject.push(...limitedData);
//         }
//         fs.writeFileSync(i, JSON.stringify(dataObject));
//     }
// }



async function pageController({ eventEmitter, batchName, browser, parentUrl, page, output,id,expectedUrl }) {
    try {
    
        const url = await page.url()
        // if (url !== expectedUrl) {
        //     recordError({batchName,error:{error,url},functionName:'pageController',dirName:'page-collection-errors'})
        //     eventEmitter.emit('promiseRejected', { parentUrl,id,batchName })
        
        //     return;
        // }
        if (!url.includes('page')) {
            const totalPages = await page.$eval('.paging ul', el => parseInt(el.lastElementChild.previousElementSibling.innerText) - 1)
            const commonPageUrlPatter = await page.$eval('.paging ul', el => el.lastElementChild.previousElementSibling.querySelector('a').href)
            const nextPageUrl = commonPageUrlPatter.substring(0, commonPageUrlPatter.lastIndexOf('=') + 1)

            if (process.env.NODE_ENV === 'test') {

                eventEmitter.emit('totalPages', totalPages)
            }
          
            if (totalPages > 0) {
      
                for (let i = 2; i <= totalPages; i++) {
                    
                    const nextPage = `${nextPageUrl}${i}`
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

                    await page.waitForSelector('.productGrid')
              
                   const products = await extractPageData({ page })
             
                   await saveData({ data: products, output })
               
        }

        if (url.includes('page')) {
      
            await page.waitForSelector('.productGrid')
    
           const products = await extractPageData({ page })
     
           await saveData({ data: products, output })
       
        }


    } catch (error) {
        recordError({batchName,error:{error,url},functionName:'pageController',dirName:'page-collection-errors'})
        debugger;
    }

}



const pages = [
    { startUrl: 'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044', output: ['page-data/moda/kadın/giyim/alt-giyim/jean-pantolon/koton.json'], pageController, batchName: 'koton' },
    { startUrl: 'https://www.koton.com/tr/erkek/giyim/alt-giyim/jean-pantolon/c/M01-C01-N01-AK102-K100044', output: ['page-data/moda/erkek/giyim/alt-giyim/jean-pantolon/koton.json'], pageController, batchName: 'koton' },
    //  { startUrl: 'https://www.defacto.com.tr/mini-elbise', output: ['page-data/moda/kadın/giyim/elbise/defacto.json'], pageController, batchName: 'defacto' },
]

module.exports = {
    pages,
    pageController
}


