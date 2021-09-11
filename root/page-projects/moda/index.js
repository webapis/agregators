const { URL } = require('url');
const { defactoPageHandler } = require('./defacto')
const {kotonPageHandler}=require('./koton')
async function handlePageFunction({ page, userData }) {

    const url = await page.url()
    const hostname = new URL(url).hostname;
    if (hostname === 'www.defacto.com.tr') {
        await defactoPageHandler({ page, userData })
    }
    if (hostname === 'www.koton.com') {
        await kotonPageHandler({ page, userData })
    }




}

module.exports = { handlePageFunction }