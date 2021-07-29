const { promiseConcurrency } = require('../../utils/promise-concurrency');
const puppeteer = require('puppeteer')
const assert = require('assert')
let eventEmitter = promiseConcurrency({
    batchConcurrency: 3, rejectedRetry: 3,
    taskName: 'dataCollection'
});
global.pc_eventEmitter = eventEmitter
describe('dataCollection tests', function () {
    it('kotonPageHandler detailPage', async function () {
        try {
            this.timeout(200000)
            
            const { kotonPageHandler } = require('../../page-projects/moda/koton')
            
            const browser = await puppeteer.launch({ headless: false, timeout: 200000 })
            global.browser = browser
            const page = await browser.newPage()
            await page.goto('https://www.koton.com/tr/kadin-belden-baglamali-sort-pamuklu/p/1YAL28043IK045#tab-1', { timeout: 200000 })
            

            await kotonPageHandler({ page, userData: { output: 'test/data' } })
            const enqueudUrls = global.enqueuedUrls
            // const actual = enqueudUrls.length
            
            //  assert.strictEqual(totalExtectedPages, actual)
            
        } catch (error) {
            
        }
    })
    it('kotonPageHandler initial listPage', async function () {
        try {


            this.timeout(200000)
            
            const { kotonPageHandler } = require('../../page-projects/moda/koton')
            
            const browser = await puppeteer.launch({ headless: false, timeout: 200000 })
            const page = await browser.newPage()
            await page.goto('https://www.koton.com/tr/kadin/giyim/alt-giyim/c/M01-C02-N01-AK102?text=&q=%3Arelevance%3Acategories%3AK100052&K100052=on#', { timeout: 200000 })
            

            await kotonPageHandler({ page, userData: { output: 'ttt' } })
            const enqueudUrls = global.enqueuedUrls
            // const actual = enqueudUrls.length
            
            //  assert.strictEqual(totalExtectedPages, actual)
            
        } catch (error) {
            
        }
    })

    it('defactoPageHandler initial listPage', async function () {
        this.timeout(200000)
        
        const { defactoPageHandler } = require('../../page-projects/moda/defacto')
        
        const browser = await puppeteer.launch({ headless: true, timeout: 200000 })
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/kadin-jean', { timeout: 200000 })
        
        await page.waitForSelector('.catalog-products')
        
        const totalExtectedPages = await page.$eval('.catalog__meta--product-count>span', el => parseInt(el.innerHTML))
        
        await defactoPageHandler({ page, userData: { output: 'ttt' } })
        const enqueudUrls = global.enqueuedUrls
        const actual = enqueudUrls.length
        
        assert.strictEqual(totalExtectedPages, actual)
        
    })


    it.only('defactoPageHandler detailPage', async function () {
        this.timeout(200000)
        
        const { defactoPageHandler } = require('../../page-projects/moda/defacto')


        
        const browser = await puppeteer.launch({ headless: false, timeout: 200000 })
        global.browser = browser
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/ceket-yaka-relax-fit-kisa-kollu-keten-gomlek-1964596', { timeout: 200000 })

        
        await defactoPageHandler({ page, userData: { output: `test/data` } })
        //  const enqueudUrls = global.enqueuedUrls
        //  const actual = enqueudUrls.length
        
        //  assert.strictEqual(totalExtectedPages, actual)
        
    })
})




