require('dotenv').config()

const fs = require('fs')


function mockGithubBranchesAndRepos(interceptedRequest) {


    const url = interceptedRequest._url

    if (url === 'https://api.github.com/user/repos') {
        const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/repos.json`)

        interceptedRequest.respond({
            status: 200,
            statusText: "",
            contentType: 'application/json',
            body: bodyRepos,

        })

    } else if (url === 'https://api.github.com/repos/codergihub/moda/branches') {
        const bodyBranches = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/branches.json`)
        interceptedRequest.respond({
            status: 202,
            statusText: "",
            contentType: 'application/json',
            body: bodyBranches,

        })
    }
    //github action is enabled
    else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/actions/workflows/aggregate.yml') {



        interceptedRequest.respond({
            status: 200,
            statusText: "",
            contentType: 'application/json',
            body: 'mock 3',

        })
    }
    else if (url.includes('https://github.com/login/oauth/authorize?client_id')) {
        //https://localhost:8888/.netlify/functions/auth-callback?code=6fda2b6463ec141c34f6&state=test_state
        interceptedRequest.respond({
            status: 302,
            statusCode: 302,
            headers: { Location: 'https://localhost:8888/.netlify/functions/auth-callback' },
        })
    }

    // else if (url.includes('https://github.com/login/oauth/access_token?client_id=')) {
    // debugger;
    //     const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/tokenResponse.json`)

    //     interceptedRequest.respond({
    //         status: 200,
    //         statusText: "",
    //         contentType: 'application/json',
    //         body: bodyRepos,

    //     })
    // }
    else {

        interceptedRequest.continue();
    }










}

module.exports = { mockGithubBranchesAndRepos }
