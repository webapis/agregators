global.enqueuedUrls = []

//enqueues urls for processing
//tracks urls and prevents dublicate urls

const { removeDublicateArrayValues } = require('../removeDublicates')

async function enqueueLink({ selector, page, userData = {} }) {
    try {
        const links = await page.$(selector)
        if (links) {
        
            const urls = await page.$$eval(selector, els => els.map(el => el.href))
          //  const withoutDublicate = removeDublicateArrayValues()
            urls.forEach(u => {
                global.enqueuedUrls.push({ url: u, userData })
                const eventEmitter = global.pc_eventEmitter;
                eventEmitter.emit('requestEnqueued', { url: u, userData })
            })
        }
    
    } catch (error) {
        console.log(error)
        process.exit(1)
        
    }
}

module.exports = { enqueueLink }