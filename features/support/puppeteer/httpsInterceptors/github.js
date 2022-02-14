const fs = require('fs')
function gitHubInterceptor(interceptedRequest, order) {

    const url = interceptedRequest._url

    if (url.includes('https://github.com/login/oauth/authorize?client_id')) {
        debugger;
        interceptedRequest.respond({
            status: 302,
            statusCode: 302,
            headers: { Location: 'https://localhost:8888/.netlify/functions/auth-callback' },
        })
    } else
        if (url === 'https://api.github.com/user/repos') {
            debugger;
            const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/repos.json`)

            interceptedRequest.respond({
                status: 200,
                statusText: "",
                contentType: 'application/json',
                body: bodyRepos,

            })

        } else
            if (url === 'https://api.github.com/repos/codergihub/moda/branches') {
                debugger;
                const bodyBranches = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/branches.json`)
                interceptedRequest.respond({
                    status: 202,
                    statusText: "",
                    contentType: 'application/json',
                    body: bodyBranches,

                })
            } else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/actions/workflows/aggregate.yml') {

                debugger;

                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            } else {
                interceptedRequest.continue();
            }
}




module.exports = { gitHubInterceptor }