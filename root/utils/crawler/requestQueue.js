const requestQueue = {

    push: function ({ url, userData = {} }) {
        global.enqueuedUrls ? global.enqueuedUrls.push({ url, userData }) : global.enqueuedUrls = [{ url, userData }]
        const eventEmitter = global.pc_eventEmitter;
        eventEmitter.emit('requestEnqueued', { url, userData })
    }
}


module.exports = { requestQueue }