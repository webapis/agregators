const {fetchPageContent}=require('../pageCollector')
const puppeteer =require('puppeteer')
const { promiseConcurrency } = require('./promiseConcurrency');
let eventEmitter = promiseConcurrency({
    batchConcurrency: 6,
    totalConcurrency: 12
  });
describe('dataCollection tests',function(){
    it.only('page dataCollection for koton product', async function(){
        this.timeout(200000)
        const browser = await puppeteer.launch({headless:false})
        await fetchPageContent({url:'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044', browser, eventEmitter,parentUrl:'',output:'page-data/moda/kadın/giyim/alt-giyim/jean-pantolon/konton.json'})
        debugger;
    })
})