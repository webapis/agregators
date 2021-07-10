const {fetchPageContent}=require('../pageCollector')
const puppeteer =require('puppeteer')
const { promiseConcurrency } = require('../promiseConcurrency');

let eventEmitter = promiseConcurrency({
    batchConcurrency: 6,
    totalConcurrency: 12
  });
describe('dataCollection tests',function(){
    it.only('page dataCollection for koton product',  function(done){
        this.timeout(200000)
        const {pageController}=require('../../page-projects/moda/koton')
         dataCollectionTest({pageController,url:'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044',eventEmitter,output:['page-data/moda/kadın/giyim/alt-giyim/jean-pantolon/konton.json'], batchName:'koton',done})   
    })

    it('page dataCollection for defacto product',  function(done){
        this.timeout(200000)
        const {pageController}=require('../../page-projects/moda/defacto')
         dataCollectionTest({pageController,url:'https://www.defacto.com.tr/kadin-jean-pantolon',eventEmitter,output:['page-data/moda/kadın/giyim/alt-giyim/jean-pantolon/defacto.json'], batchName:'defacto',done})   
    })
})

async function taskComplete({totalPages,totalRejected,totalResolved,done,browser}){
if(totalResolved+totalRejected===totalPages){
    debugger;
    await browser.close()
    done()
}
}


 function dataCollectionTest({url,pageController,output,batchName,eventEmitter,done}){
    debugger;
    let totalPages =0
    let totalResolved=0
    let totalRejected=0
    eventEmitter.on('totalPages',(tp)=>{
        totalPages =tp
      

    })
    eventEmitter.on('promiseResolved',(tp)=>{

       ++ totalResolved
    
        taskComplete({totalPages,totalRejected,totalResolved,done, browser:this.browser})
       
    })
    eventEmitter.on('promiseRejected',(tp)=>{
       ++ totalRejected
     
        taskComplete({totalPages,totalRejected,totalResolved,done,browser:this.browser})
      
    })

     puppeteer.launch({headless:false}).then(browser=>{
         this.browser=browser
        fetchPageContent({url, browser,pageController, eventEmitter,parentUrl:'',output})({batchName,id:'123'})
     })
}