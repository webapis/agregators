require('dotenv').config()
const { autoScroll, saveData } = require('../../utils/crawler/utillty')

const { recordError } = require('../../utils/recordError')
const { enqueueLink } = require('../../utils/crawler/enqueueLink')
const { requestQueue } = require('../../utils/crawler/requestQueue')
async function extractPageData({ page }) {
    const url = await page.url()
    debugger;
    return await page.$eval('.product-content-wrap', (el, _url) => {
        let data = {}

        const productName = el.querySelector('.productDetailDescription h1').innerText
        const productCode = el.querySelector('.productNumber').innerText
        const priceNew = el.querySelector('.newPrice') && el.querySelector('.newPrice').innerText
        const normalPrice = el.querySelector('.normalPrice') && el.querySelector('.normalPrice').innerText
        const priceOld = el.querySelector('.insteadPrice') && el.querySelector('.insteadPrice').innerText.trim() //insteadPrice
        const images = document.querySelector('.productDetailImageContainer').querySelectorAll('img') && Array.from(document.querySelector('.productDetailImageContainer').querySelectorAll('img')).map(m => m.src)
        // const otherColors = el.querySelector('.product-variants__slider') && Array.from(el.querySelector('.product-variants__slider').querySelectorAll('.image-box a')).map(el => { return { link: el.href, color: el.getAttribute('data-title'), image: el.querySelector('img').src } })
        // const sizes = el.querySelector('.product-size-selector__buttons') && Array.from(el.querySelector('.product-size-selector__buttons').querySelectorAll('button')).map(m => { if (m.classList.contains('product-no-stock')) { return { size: m.value, available: false } } return { size: m.value, available: true } })
        // const color = document.querySelector('.sideMenu__box ul').querySelectorAll('li') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML).find(f => f.includes("Renk :"))
        // const material = document.querySelector('.sideMenu__box ul').querySelectorAll('li') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML).find((f, i) => i === 2).trim()
        // const modelDetail = document.querySelector('.sideMenu__box ul').querySelectorAll('li') && Array.from(document.querySelector('.sideMenu__box ul').querySelectorAll('li')).map(m => m.innerHTML).find((f, i) => i === 0).trim()
        data = { detailPageLink: _url, productName, productCode, prices: { priceNew: priceOld ? priceNew : normalPrice, priceBasket: null, priceOld }, images, stock: {}, colors: '', productDetail: '', sizes: '', payment: {}, delivery: {}, returnAndChange: {}, shareAndEarn: {}, reviews: {} }
        return data
    }, url)
}




async function kotonPageHandler({ page, userData }) {
    try {
        const { output } = userData
        const url = await page.url()
        const productList = await page.$('.product-list-container')
        debugger;
        if (!url.includes('page') && productList) {
            debugger;
            const totalPages = await page.$eval('.paging ul', el => parseInt(el.lastElementChild.previousElementSibling.innerText) - 1)
            const commonPageUrlPatter = await page.$eval('.paging ul', el => el.lastElementChild.previousElementSibling.querySelector('a').href)
            const nextPageUrl = commonPageUrlPatter.substring(0, commonPageUrlPatter.lastIndexOf('=') + 1)
            for (let i = 2; i <= totalPages; i++) {
                const nextPage = `${nextPageUrl}${i}`
                requestQueue.push({ url: nextPage, userData })
            }
        }
        if (productList) {
            await enqueueLink({ selector: '.productGrid .product-item figure > a', page, userData })
        }
        const productDetailImageContainer = await page.$('.productDetailImageContainer')
        debugger;
        if (productDetailImageContainer) {
            const product = await extractPageData({ page })
            debugger;
        }

        debugger;
    } catch (error) {
        debugger;
        recordError({ batchName: 'koton', functionName: 'kotonPageHandler', dirName: 'page-collection-errors' })
        debugger;
    }

}






module.exports = {

    kotonPageHandler
}



