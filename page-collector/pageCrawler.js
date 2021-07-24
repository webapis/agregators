const { puppeteerCrawler } = require('../utils/crawler/puppeteerCrawler')
const { URL } = require('url')
const handlerPath = `${process.cwd()}/page-projects/${process.env.projectName}`
const { handlePageFunction } = require(handlerPath)
const { requestQueue } = require('../utils/crawler/requestQueue')


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
        } else {
            req.abort();
        }
    });
}

async function postNavHook({ page, origin }) {
  
}

async function pageCrawler({ taskSequelizerEventEmitter }) {
 
    requestQueue.push({ url: 'https://www.defacto.com.tr/kadin-jean' })

    await puppeteerCrawler({ handlePageFunction, headless:false, preNavHook, postNavHook })
 

}
module.exports = { pageCrawler }