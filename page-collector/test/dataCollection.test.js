const { promiseConcurrency } = require('../../utils/promise-concurrency');
const puppeteer = require('puppeteer')
const assert = require('assert')
let eventEmitter = promiseConcurrency({
    batchConcurrency: 3, rejectedRetry: 3,
    taskName: 'dataCollection'
});
global.pc_eventEmitter = eventEmitter
describe('dataCollection tests', function () {

    it('page dataCollection for koton product', function (done) {
        debugger;
        this.timeout(200000)
        const { pageController } = require('../../page-projects/moda/koton')

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


    it.only('defactoPageHandler detailPage', async function () {
        this.timeout(200000)
        debugger;
        const { defactoPageHandler } = require('../../page-projects/moda/defacto')


        debugger;
        const browser = await puppeteer.launch({ headless: false, timeout: 200000 })
        const page = await browser.newPage()
        await page.goto('https://www.defacto.com.tr/slim-fit-blazer-ceket-1197669', { timeout: 200000 })

        //    await page.waitForSelector('.catalog-products')

        //  const totalExtectedPages = await page.$eval('.catalog__meta--product-count>span', el => parseInt(el.innerHTML))

        debugger;
        await defactoPageHandler({ page, userData: { output: `page-collector/test/data` } })
        const enqueudUrls = global.enqueuedUrls
        const actual = enqueudUrls.length
        debugger;
        assert.strictEqual(totalExtectedPages, actual)
        debugger;
    })
})




