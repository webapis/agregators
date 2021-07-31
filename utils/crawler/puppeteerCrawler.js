const puppeteer = require('puppeteer');
const { promiseConcurrency } = require('../promise-concurrency');
const { pageController } = require('./pageController')
const { fb_steps } = require('../firebase/firebaseEventEmitter')
const { URL } = require('url')

async function puppeteerCrawler({ handlePageFunction, headless, preNavHook, postNavHook, complete }) {
 
        let eventEmitter = promiseConcurrency({
            batchConcurrency: 5, rejectedRetry: 3,
            taskName: 'dataCollection'
        });
        global.pc_eventEmitter = eventEmitter
        const initialurls = global.enqueuedUrls

        const browser = await puppeteer.launch({ headless, timeout: 120000 });
        global.browser = browser
        eventEmitter.on('promiseExecComplete', async () => {

            eventEmitter = null;
            await browser.close();
            complete()
        });
        eventEmitter.on('requestEnqueued', (request) => {
            const { url, userData } = request
            const hostName = new URL(url).hostname;
            const batchName = hostName.replace('www.', '').replace('https://', '').replace('.com.tr', '').replace('.com', '').replace('.','')

            const nextPromise = pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData,sync:false })
            nextPromise.batchName = batchName
            nextPromise.sync = false
            eventEmitter.emit('promiseAttached', { promise: nextPromise, unshift: false });
        })

        if (initialurls.length > 0) {
            initialurls.forEach(obj => {
                const { url, userData } = obj
                const hostName = new URL(url).hostname;
                const batchName = hostName.replace('www.', '').replace('https://', '').replace('.com.tr', '').replace('.com', '').replace('.','')
                const nextPromise = pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData,sync:true })
                nextPromise.batchName = batchName
                nextPromise.sync = true
                eventEmitter.emit('promiseAttached', { promise: nextPromise, unshift: false });

            })
        }
        
        global.browser = browser

   
}

module.exports = { puppeteerCrawler }