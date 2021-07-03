require('dotenv').config()
const makeDir =require('make-dir')
const fs =require('fs')
const path =require('path')
const { fetchPageContent } = require('../../page-collector/pageCollector');

async function extractPageData ({page}){
  try {
    
 
 return await page.$$eval('.product-items',els=>{
    const data =[]
    els.forEach(el=>{
     const dataDocuments =JSON.parse(el.querySelector('.products-card').getAttribute('data-documents'))
     const  detailPageLink=`https://defacto.com.tr`+ el.querySelector('.picture-link').getAttribute('href')
     const imageSrc =el.querySelector('div.picture > a > img').getAttribute('data-srcset') 
     const productName = dataDocuments.ProductName
     const salePrice =el.querySelector('.sale-price') &&el.querySelector('.sale-price').innerHTML
     const marketPrice =el.querySelector('.market-price') &&el.querySelector('.market-price').innerHTML
     const discountInBasket =el.querySelector('.sale > span.percentage') &&el.querySelector('.sale > span.percentage').innerHTML //sepette indirim
     const optsrc =  'https:' +imageSrc.substring(imageSrc.lastIndexOf('//')).replace('3000w', '').trim();
      data.push({detailPageLink,productName,price:{salePrice,discountInBasket,marketPrice}, image:{optsrc}})
    })
    return data;
  })
} catch (error) {
    debugger;
}
}

async function saveData({data,output}){
  debugger;
  for(let i of output){
    debugger;
    let dataObject = [];
    makeDir.sync(path.dirname(i))
  
    if (fs.existsSync(i)) {
      const dataFromFile = fs.readFileSync(i, { encoding: 'utf-8' });
      dataObject = JSON.parse(dataFromFile);
      dataObject.push(...data);
    } else {
      dataObject.push(...data);
    }
    fs.writeFileSync(i, JSON.stringify(dataObject));

    debugger;
  }




  console.log('data reached..')
}



async function pageController({ eventEmitter, batchName, browser, parentUrl, page, output }) {
  try {

    const projectName = process.env.projectName
    const url = await page.url()
    if(!url.includes('page')){
      debugger;
      const totalPages = await page.$eval('.pagination > a.page-link.next',el=> parseInt(el.href.substring(el.href.indexOf('=')+1)))
    debugger;
      for (let i = 2; i < totalPages; i++) {
        const nextPage =`${url}?lt=v2&page=${i}`
              const nextPagePromise = fetchPageContent({
          url:nextPage,
          browser,
          eventEmitter,
          pageController,
          parentUrl,
          output,
        
        })
        nextPagePromise.batchName = batchName;
    
        eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: false });
      }

      const  products = await extractPageData({page})
      debugger;
      await saveData({batchName,projectName,data:products,output})
      debugger;
    }
    if(url.includes('page')){
      
    const  products =await extractPageData({page})
    await saveData({batchName,projectName,data:products})
        debugger;
    }

debugger;

} catch (error) {
    debugger;
}
}



const pages = [
  { startUrl: 'https://www.defacto.com.tr/kadin-jean-pantolon',output:['page-data/moda/kadın/giyim/alt-giyim/jean-pantolon/defacto.json'], pageController, batchName: 'defacto' },
  { startUrl: 'https://www.defacto.com.tr/erkek-denim-pantolon',output:['page-data/moda/erkek/giyim/alt-giyim/jean-pantolon/defacto.json'], pageController, batchName: 'defacto' },
  { startUrl: 'https://www.defacto.com.tr/kiz-cocuk-jean-pantolon',output:['page-data/moda/kız-çocuk/giyim/alt-giyim/jean-pantolon/defacto.json'], pageController, batchName: 'defacto' },
]

module.exports = {
pages
}



