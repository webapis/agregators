const fs =require('fs')
function firebaseMock(interceptedRequest) {
    const url = interceptedRequest._url
   if (url.includes('https://securetoken.googleapis.com/v1/token')) 
   {
    const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/firebase-oauth/restResponseToken.json`)
    
        interceptedRequest.respond({
            status: 200,
            statusText: "",
            contentType: 'application/json',
            body: bodyRepos
        })
    } else if (url.includes('https://localhost:8888/.netlify/functions/google-auth-callback')) {
       
     
        interceptedRequest.continue();
    }

    else {
        interceptedRequest.continue();
    }

}

module.exports = { firebaseMock }