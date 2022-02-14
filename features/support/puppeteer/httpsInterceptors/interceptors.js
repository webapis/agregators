const { googleAPIsInterceptor } = require('./googleapis')
const { gitHubInterceptor } = require('./github')
const { googleInterceptor } = require('./google')
async function httpInterceptors(scenario) {

    const { pickle: { name: order } } = scenario

    await global.page.setRequestInterception(true);

    global.page.on('request', (interceptedRequest) => {

        const url = interceptedRequest._url

        if (url.includes('github.com')) {
          
            gitHubInterceptor(interceptedRequest, order)
        }
        else if (url.includes('google.com')) {
            debugger;
            googleInterceptor(interceptedRequest, order)
        }
        else if (url.includes('googleapis.com')) {
         
            googleAPIsInterceptor(interceptedRequest, order)
        }
        else
            interceptedRequest.continue();
    })
}

module.exports = { httpInterceptors }