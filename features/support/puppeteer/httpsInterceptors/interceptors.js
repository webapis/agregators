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

    // global.browser.on('targetcreated', async target => {


    //     debugger;
    //     if (target.type() === 'page') {
    //         const newPage = await target.page();
    //         const url =newPage.url()
    //         debugger;
    //         // newPage.once('request', (interceptedRequest) => {
    //         //     const url = interceptedRequest._url
    //         //     debugger;
    //         // }
    //         // )

    //     }
    // })
    // global.page.once('popup', async obj => {
    //     debugger;
    //     const { url } = obj._target._targetInfo;
    //     if (url === 'https://github.com/codergihub/workflow_runner/actions') {
    //         global.actionEnabled = true;
    //         debugger;
    //     }
    //     debugger;

    //     debugger;
    // })
}

module.exports = { httpInterceptors }