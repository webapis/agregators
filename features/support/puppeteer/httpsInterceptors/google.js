const fs = require('fs')
function googleInterceptor(interceptedRequest) {
    const url = interceptedRequest._url
    if (url.includes('https://accounts.google.com/o/oauth2/v2/auth?scope=')) {

debugger;
        interceptedRequest.continue({ url: 'https://localhost:8888/google-auth-callback' })

        // } else if (url.includes('authorization_code')) {
        //     const body = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/branches.json`)
        //     interceptedRequest.respond({
        //         status: 200,
        //         statusText: "",
        //         contentType: 'application/json',
        //         body
        //     })
        // } 
    }
    else {
        interceptedRequest.continue();
    }
}

module.exports = { googleInterceptor }