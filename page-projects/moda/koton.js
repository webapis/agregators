require('dotenv').config()
const { saveData } = require('../../utils/crawler/utillty')

const { recordError } = require('../../utils/recordError')
const { enqueueLink } = require('../../utils/crawler/enqueueLink')
const { requestQueue } = require('../../utils/crawler/requestQueue')
async function extractPageData({ page }) {
    const url = await page.url()

    return await page.$eval('.product-content-wrap', (el, _url) => {
        let data = {}

        const productName = el.querySelector('.productDetailDescription h1').innerText
        const productCode = el.querySelector('.productNumber').innerText
        const priceNew = el.querySelector('.newPrice') && el.querySelector('.newPrice').innerText
        const normalPrice = el.querySelector('.normalPrice') && el.querySelector('.normalPrice').innerText
        const priceOld = el.querySelector('.insteadPrice') && el.querySelector('.insteadPrice').innerText.trim() //insteadPrice
        const images = el.querySelector('.productDetailImageContainer').querySelectorAll('img') && Array.from(document.querySelector('.productDetailImageContainer').querySelectorAll('img')).map(m => m.src)
        const otherColors = el.querySelector('.color ul') && Array.from(el.querySelector('.color ul').querySelectorAll('li')).filter(f => !f.classList.contains('selected')).map(m => m.querySelector('a').href)
        const sizes = el.querySelector('.size-items') && Array.from(el.querySelector('.size-items').querySelectorAll('li')).map(m => { return { size: m.querySelector('a').innerHTML, available: true } })
        const color = productName.substring(productName.indexOf('-') + 1).trim()
        const material = Array.from(el.querySelector('.product-details').querySelectorAll('p')).map(m => m.innerText).find(f => f.includes('%'))
        const modelDetail = Array.from(document.querySelector('.product-details').querySelectorAll('p')).map(m => m.innerText).find(f => f.includes('Boy:'))
        data = { detailPageLink: _url, productName, productCode, prices: { priceNew: priceOld ? priceNew : normalPrice, priceBasket: null, priceOld }, images, stock: {}, otherColors, productDetail: { color, material, modelDetail }, sizes, payment: {}, delivery: {}, returnAndChange: {}, shareAndEarn: {}, reviews: {} }
        return data
    }, url)
}




async function kotonPageHandler({ page, userData }) {
    const { output, pageType } = userData
    debugger;
    if (pageType === 'list') {
        debugger;
        await page.waitForSelector('.product-list-container',{ timeout: 60000 })
        debugger;
        const hasPagination = await page.$('.paging ul')
        if (hasPagination) {
            const totalPages = await page.$eval('.paging ul', el => parseInt(el.lastElementChild.previousElementSibling.innerText) - 1)
            const commonPageUrlPatter = await page.$eval('.paging ul', el => el.lastElementChild.previousElementSibling.querySelector('a').href)
            const nextPageUrl = commonPageUrlPatter.substring(0, commonPageUrlPatter.lastIndexOf('=') + 1)
            for (let i = 2; i <= totalPages; i++) {
                const nextPage = `${nextPageUrl}${i}`
                requestQueue.push({ url: nextPage, userData: { ...userData, pageType: 'nextPage' } })
            }

        }

    }
    if (pageType === 'list' || pageType === 'nextPage') {
        debugger;
        await enqueueLink({ selector: '.productGrid .product-item figure > a', page, userData: { ...userData, pageType: 'detail' } })
    }


    if (pageType === 'detail') {
        debugger;
        await page.waitForSelector('.productDetailImageContainer', { timeout: 60000 })
        debugger;
        const product = await extractPageData({ page })

        const { otherColors } = product
        if (otherColors && otherColors.length > 0) {
            let promises = []
            otherColors.forEach(url => {
                promises.push(fetchOtherColorPages({ url }))
            })

            const fetchedOtherColors = await Promise.all(promises)
            const productWithOtherColors = { ...product, otherColors: fetchedOtherColors }
            saveData({ data: productWithOtherColors, output, filename: 'koton.json' })

        } else {
            saveData({ data: product, output, filename: 'koton.json' })
        }

    }





}

async function fetchOtherColorPages({ url }) {
    const page = await global.browser.newPage()
    try {
        await page.setRequestInterception(true);
        page.on('request', req => {
            const resourceType = req.resourceType();
            if (resourceType === 'image') {

                debugger;
                req.respond({
                    status: 200,
                    contentType: 'image/jpeg',
                    body: ''
                });
                debugger;
                // req.abort();
            } else {
                req.continue();
            }
        });
        await page.goto(url)
        await page.waitForSelector('.productDetailImageContainer')
        const data = await extractPageData({ page })
        await page.close()
        return data
    } catch (error) {
        debugger;
        recordError({ batchName: 'koton', functionName: 'fetchOtherColorPages', dirName: 'page-collection-errors' })
        await page.close()
    }

}




module.exports = {

    kotonPageHandler
}



