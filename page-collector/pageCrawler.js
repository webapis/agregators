const { puppeteerCrawler } = require('../utils/crawler/puppeteerCrawler')
const { URL } = require('url')
//const { fb_steps } = require('../utils/firebase/firebaseEventEmitter')
const handlerPath = `${process.cwd()}/page-projects/${process.env.projectName}`
const { handlePageFunction } = require(handlerPath)
const { requestQueue } = require('../utils/crawler/requestQueue')
const sitemaps = require('./project.sitemap')

async function preNavHook({ page }) {
    // await page.setRequestInterception(true);
    // page.on('request', req => {
    //     const resourceType = req.resourceType();
    //     if (
    //         resourceType === 'document' ||
    //         resourceType === 'stylesheet' ||
    //         resourceType === 'script'
    //     ) {
    //         req.continue();
    //     } else {
    //         req.abort();
    //     }
    // });
}

async function postNavHook({ page, origin }) {

}

async function pageCrawler({ taskSequelizerEventEmitter }) {
    try {
        const projectUrls = sitemaps[process.env.projectName]
        projectUrls.forEach(u => {
            const { dest, source } = u
            source.forEach(s => {
                requestQueue.push({ url: s, userData: { output: dest } })
            })
        })
        await puppeteerCrawler({
            handlePageFunction, headless: true, preNavHook, postNavHook, complete: () => {
                taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')
            }
        })
    } catch (error) {
        console.log(error)
        taskSequelizerEventEmitter.emit('taskFailed', error)
    }

}
module.exports = { pageCrawler }