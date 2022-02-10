const { mockGithubBranchesAndRepos } = require('./mock_github_branches_and_repos')
const { mockGoogleOAuth } = require('./mock_google_oauth')
async function mockRequest() {
    await global.page.setRequestInterception(true);
    global.page.on('request', (interceptedRequest) => {
        const url = interceptedRequest._url
        if (url.includes('google')) {
            mockGoogleOAuth(interceptedRequest)
        } else if (url.includes('github')) {
            mockGithubBranchesAndRepos(interceptedRequest)
        } else {
            interceptedRequest.continue();
        }
    })
}

module.exports={mockRequest}