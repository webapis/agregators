require('dotenv').config()
const makeDir =require('make-dir')
var json2xls = require('json2xls');
const fs =require('fs')
const path =require('path')
const { fetchPageContent } = require('../../page-collector/pageCollector')








async function pageController({ eventEmitter, batchName, browser, parentUrl, page, output }) {
  try {
    


const search = process.env.search;

  const pageUrl =await page.url()
   const searchBox =await page.$eval('#site-search-text',el=> el.value)

  if(pageUrl==='https://find-and-update.company-information.service.gov.uk/' && searchBox===''){
 
  

    await page.goto(parentUrl+`search/companies?q=apple`)

    const urlsExist = await page.$$('.pager .page')
    if (urlsExist.length > 0) {

      const urls = await page.$$eval('.pager .page', (els) => els.map(e => e.href))
      const withoutLastUrl = urls.filter((u,i)=> i<urls.length-1).filter((u,i)=>i<2)
 
      //urls.filter((f,i)=>i<10).forEach(url => {
        withoutLastUrl.forEach(url => {
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
  }



if(pageUrl.includes('search/companies?q=')){

  await page.waitForSelector('#results .type-company')
  const typeCompany  = await page.$$('.type-company a')
  if(typeCompany.length>0){
    const urls = await page.$$eval('.type-company a', (els) => els.map(e => e.href).filter((f,i)=>i<5))
  
    urls.forEach((url,i) => {

   //   if(i<5){
        
      
      const offierurl =url+'/officers'
    
      const nextPagePromise = fetchPageContent({
        url:offierurl,
        browser,
        eventEmitter,
        pageController,
        parentUrl,
        output,
      })
      nextPagePromise.batchName = batchName;
  
      eventEmitter.emit('promiseAttached', { promise: nextPagePromise, unshift: false });

   // }
    })
  }

}

if(pageUrl.includes('/officers')){

  await page.waitForSelector('[class*="appointment-"]')


const appointmentListExists  = await page.$$('[class*="appointment-"]')

if(appointmentListExists.length>0){
 
  const companyNumber = await page.$eval('#company-number > strong',el=> el.innerText)
  const companyName =await page.$eval('#content-container > div.company-header > p.heading-xlarge',el=> el.innerText)
  const officer  = await page.$$eval('[class*="appointment-"]',(els,_company_name,_company_number)=>{
    let data =[]
    els.forEach(el=>{
      
      const oficerName =el.querySelector('[id*="officer-name-"]') && el.querySelector('[id*="officer-name-"]').innerText
      const role =el.querySelector('[id*="officer-role"]') &&  el.querySelector('[id*="officer-role"]').innerText
      const nationality = el.querySelector('[id*="officer-nationality"]') && el.querySelector('[id*="officer-nationality"]').innerText
      const cofRes = el.querySelector('[id*="officer-country-of-residence"]') && el.querySelector('[id*="officer-country-of-residence"]').innerText
      const occupation = el.querySelector('[id*="officer-occupation"]') && el.querySelector('[id*="officer-occupation"]').innerText
      const dateofbirth =el.querySelector('[id*="officer-date-of-birth"]') && el.querySelector('[id*="officer-date-of-birth"]').innerText
    const appointedon= el.querySelector('[id*="officer-appointed-on-"]') && el.querySelector('[id*="officer-appointed-on-"]').innerText
      data.push({oficerName,role,nationality,cofRes,occupation,dateofbirth,appointedon, companyName:_company_name,companyNumber:_company_number})
    })

    return data
  },companyName,companyNumber)

  let dataObject = [];
  makeDir.sync(path.dirname(output))

  if (fs.existsSync(output)) {
    const data = fs.readFileSync(output, { encoding: 'utf-8' });
    dataObject = JSON.parse(data);
    dataObject.push(...officer);
  } else {
    dataObject.push(...officer);
  }
  fs.writeFileSync(output, JSON.stringify(dataObject));
  var xls = json2xls(dataObject);
  const excelFolder =path.dirname(output)+'/excel/'
  const excellFileName =path.basename(output).replace('.json','')+'.xlsx'
  const excelloutput=excelFolder+excellFileName
  makeDir.sync( path.dirname(excelloutput))
  console.log('excelloutput',excelloutput)

  fs.writeFileSync(excelloutput, xls,'binary');
  debugger;
  //eventEmitter.emit('data_collected')
debugger;
  await  database.ref(`projects/${process.env.projectName}`).update({
      totalDataCollected: dataObject.length
    },(error)=>{
      debugger;
    });
debugger;
  console.log('data reached..')
}

}
} catch (error) {
    debugger;
}
}





const pages = [{ startUrl: 'https://find-and-update.company-information.service.gov.uk/', pageController, batchName: 'companyinfo' }]

module.exports = {
  pages
}



//https://www.freelancer.com/projects/web-scraping/Automated-web-scraping-required-Job/details