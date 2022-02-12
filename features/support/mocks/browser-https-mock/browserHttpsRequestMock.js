const { mockGithubBranchesAndRepos } = require('./mock_github_branches_and_repos')
const { mockGoogleOAuth } = require('./mock_google_oauth')
const { firebaseMock } = require('./firebase_mocks')
async function mockBrowserRequest() {
    await global.page.setRequestInterception(true);
    global.page.on('request', (interceptedRequest) => {
        const url = interceptedRequest._url
        if (url.includes('https://securetoken.googleapis.com/v1/token')) {
     
            firebaseMock(interceptedRequest)
        } else
            if (url.includes('google')) {
                mockGoogleOAuth(interceptedRequest)
            }

            else if (url.includes('github') || url.includes('https://localhost:8888/.netlify/functions/auth-callback')) {
            
                mockGithubBranchesAndRepos(interceptedRequest)
            }

            else {
                interceptedRequest.continue();
            }
    })
}

module.exports = { mockBrowserRequest }