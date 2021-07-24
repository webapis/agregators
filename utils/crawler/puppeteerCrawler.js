const puppeteer = require('puppeteer');
const { promiseConcurrency } = require('../promise-concurrency');
const { pageController } = require('./pageController')
const { URL } = require('url')

async function puppeteerCrawler({ handlePageFunction, headless, preNavHook, postNavHook }) {
    let eventEmitter = promiseConcurrency({
        batchConcurrency: 3, rejectedRetry: 3,
        taskName: 'dataCollection'
    });
    global.pc_eventEmitter = eventEmitter
    const initialurls = global.enqueuedUrls

    const browser = await puppeteer.launch({ headless, timeout: 120000 });

    eventEmitter.on('requestEnqueued', (request) => {
        const { url, userData } = request
        const hostName = new URL(url).hostname;
        const batchName = hostName.replace('www.', '').replace('https://', '').replace('.com.tr', '')
     
        const nextPromise = pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData })
        nextPromise.batchName = batchName
        eventEmitter.emit('promiseAttached', { promise: nextPromise, unshift: false });
    })

    if (initialurls.length > 0) {
        initialurls.forEach(obj => {
            const { url, userData } = obj
            const hostName = new URL(url).hostname;
            const batchName = hostName.replace('www.', '').replace('https://', '').replace('.com.tr', '')

            const nextPromise = pageController({ url, browser, eventEmitter, handlePageFunction, preNavHook, postNavHook, userData })
            nextPromise.batchName = batchName
            eventEmitter.emit('promiseAttached', { promise: nextPromise, unshift: false });

        })
    } else {
        console.error('initial urls not provided')
    }
    global.browser = browser
}

module.exports = { puppeteerCrawler }