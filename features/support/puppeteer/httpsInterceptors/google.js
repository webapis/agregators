const fs = require('fs')
function googleInterceptor(interceptedRequest) {
    const url = interceptedRequest._url
    if (url.includes('https://accounts.google.com/o/oauth2/v2/auth?scope=')) {

debugger;
        interceptedRequest.continue({ url: 'https://localhost:8888/google-auth-callback?state=test_state&code=123' })
    }
    else {
        interceptedRequest.continue();
    }
}

module.exports = { googleInterceptor }