const fs = require('fs')

function googleAPIsInterceptor(interceptedRequest) {
    const url = interceptedRequest._url
    if (url.includes('https://securetoken.googleapis.com/v1/token')) {
        const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/firebase-oauth/restResponseToken.json`)
        interceptedRequest.respond({
            status: 200,
            statusText: "",
            contentType: 'application/json',
            body: bodyRepos
        })
    }
    else {
        interceptedRequest.continue();
    }
}

module.exports = { googleAPIsInterceptor }