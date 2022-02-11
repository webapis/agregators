const { mockGithubBranchesAndRepos } = require('./mock_github_branches_and_repos')
const { mockGoogleOAuth } = require('./mock_google_oauth')
async function mockBrowserRequest() {
    await global.page.setRequestInterception(true);
    global.page.on('request', (interceptedRequest) => {
        const url = interceptedRequest._url
        console.log('url', url)
        if (url.includes('google')) {
            mockGoogleOAuth(interceptedRequest)
        }

        else if (url.includes('github') || url.includes('https://localhost:8888/.netlify/functions/auth-callback')) {
            debugger;
            mockGithubBranchesAndRepos(interceptedRequest)
        } else {
            interceptedRequest.continue();
        }
    })
}

module.exports = { mockBrowserRequest }