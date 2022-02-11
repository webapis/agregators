require('dotenv').config()
const fs = require('fs')
function mockFirebaseOAuth(interceptedRequest) {
debugger;
    const url = interceptedRequest._url
    if (url === '/v1/accounts:signInWithIdp?key=') {
        const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/firebase-oauth/tokenResponse.json`)
        interceptedRequest.respond({
            status: 200,
            statusText: "",
            contentType: 'application/json',
            body: bodyRepos,
        })
    } 
    else {
        interceptedRequest.continue();
    }
}
module.exports = { mockFirebaseOAuth }
