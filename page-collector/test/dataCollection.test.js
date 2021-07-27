const { promiseConcurrency } = require('../../utils/promise-concurrency');
const puppeteer = require('puppeteer')
const assert = require('assert')
let eventEmitter = promiseConcurrency({
    batchConcurrency: 3, rejectedRetry: 3,
    taskName: 'dataCollection'
});
global.pc_eventEmitter = eventEmitter
describe('dataCollection tests', function () {
    it.only('kotonPageHandler detailPage', async function () {
        try {
            this.timeout(200000)
            debugger;
            const { kotonPageHandler } = require('../../page-projects/moda/koton')
            debugger;
            const browser = await puppeteer.launch({ headless: false, timeout: 200000 })
            const page = await browser.newPage()
            await page.goto('https://www.koton.com/tr/kadin-cicekli-gomlek-keten-kisa-kollu-belden-baglamali/p/1YAL68296IW01D#tab-1', { timeout: 200000 })
            debugger;
        
            await kotonPageHandler({ page, userData: { output: 'ttt' } })
            const enqueudUrls = global.enqueuedUrls
            // const actual = enqueudUrls.length
            debugger;
            //  assert.strictEqual(totalExtectedPages, actual)
            debugger;
        } catch (error) {
            debugger;
        }
    })
    it('kotonPageHandler initial listPage', async function () {
        try {


            this.timeout(200000)
            debugger;
            const { kotonPageHandler } = require('../../page-projects/moda/koton')
            debugger;
            const browser = await puppeteer.launch({ headless: false, timeout: 200000 })
            const page = await browser.newPage()
            await page.goto('https://www.koton.com/tr/kadin/giyim/alt-giyim/c/M01-C02-N01-AK102?text=&q=%3Arelevance%3Acategories%3AK100052&K100052=on#', { timeout: 200000 })
            debugger;
        
            await kotonPageHandler({ page, userData: { output: 'ttt' } })
            const enqueudUrls = global.enqueuedUrls
            // const actual = enqueudUrls.length
            debugger;
            //  assert.strictEqual(totalExtectedPages, actual)
            debugger;
        } catch (error) {
            debugger;
        }
    })

    it('defactoPageHandler initial listPage', async function () {
        this.timeout(200000)
        debugger;
        const { defactoPageHandler } = require('../../page-projects/moda/defacto')
        debugger;
        const browser = await puppeteer.launch({ headless: true, timeout: 200000 })
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/kadin-jean', { timeout: 200000 })
        debugger;
        await page.waitForSelector('.catalog-products')
        debugger;
        const totalExtectedPages = await page.$eval('.catalog__meta--product-count>span', el => parseInt(el.innerHTML))
        debugger;
        await defactoPageHandler({ page, userData: { output: 'ttt' } })
        const enqueudUrls = global.enqueuedUrls
        const actual = enqueudUrls.length
        debugger;
        assert.strictEqual(totalExtectedPages, actual)
        debugger;
    })


    it('defactoPageHandler detailPage', async function () {
        this.timeout(200000)
        debugger;
        const { defactoPageHandler } = require('../../page-projects/moda/defacto')


        debugger;
        const browser = await puppeteer.launch({ headless: true, timeout: 200000 })
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/slim-fit-blazer-ceket-1197669', { timeout: 200000 })

        debugger;
        await defactoPageHandler({ page, userData: { output: `page-collector/test/data` } })
        //  const enqueudUrls = global.enqueuedUrls
        //  const actual = enqueudUrls.length
        debugger;
        //  assert.strictEqual(totalExtectedPages, actual)
        debugger;
    })
})




