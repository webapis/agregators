const { puppeteerCrawler } = require('../utils/crawler/puppeteerCrawler')
const { URL } = require('url')
//const { fb_steps } = require('../utils/firebase/firebaseEventEmitter')
const handlerPath = `${process.cwd()}/page-projects/${process.env.projectName}`
const { handlePageFunction } = require(handlerPath)
const { requestQueue } = require('../utils/crawler/requestQueue')
const sitemaps = require('./project.sitemap')

async function preNavHook({ page }) {
    await page.setRequestInterception(true);
    page.on('request', req => {
        const resourceType = req.resourceType();
        if (
            resourceType === 'document' ||
            resourceType === 'stylesheet' ||
            resourceType === 'script'
        ) {
            req.continue();
        } else if (resourceType === 'image') {
           
            req.abort();
        } else {
            req.continue();
        }
    });
}

async function postNavHook({ page, origin }) {

}

async function pageCrawler({ taskSequelizerEventEmitter }) {
    try {
        debugger;
        const projectUrls = sitemaps[process.env.projectName]
        projectUrls.forEach(u => {
            const { dest, source } = u
            source.forEach(s => {
                requestQueue.push({ url: s, userData: { output: dest, pageType: 'list' } })
            })
        })

  
        await puppeteerCrawler({
            handlePageFunction, headless: process.env.HEADLESS === 'false' ? false : true, preNavHook, postNavHook, complete: () => {
                taskSequelizerEventEmitter.emit('taskComplete', 'page_collection')
            }
        })
    } catch (error) {
        console.log('page_collection_error', error)
        taskSequelizerEventEmitter.emit('taskFailed', 'page_collection')
    }

}
module.exports = { pageCrawler }