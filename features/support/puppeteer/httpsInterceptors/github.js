const fs = require('fs')
let repoForked = false;
global.actionEnabled = false;
function gitHubInterceptor(interceptedRequest, order) {
    const orderInt =parseInt(order)
    const enableOrder ='9'
    if (orderInt > enableOrder) {
        repoForked === true
        global.actionEnabled = true
    }
    const url = interceptedRequest._url

    if (url.includes('https://github.com/login/oauth/authorize?client_id')) {

        interceptedRequest.respond({
            status: 302,
            statusCode: 302,
            headers: { Location: 'https://localhost:8888/.netlify/functions/auth-callback' },
        })
    } else
        if (url === 'https://api.github.com/user/repos') {

            const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/repos.json`)

            interceptedRequest.respond({
                status: 200,
                statusText: "",
                contentType: 'application/json',
                body: bodyRepos,

            })

        } else
            if (url === 'https://api.github.com/repos/codergihub/moda/branches') {

                const bodyBranches = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/branches.json`)
                interceptedRequest.respond({
                    status: 202,
                    statusText: "",
                    contentType: 'application/json',
                    body: bodyBranches,

                })


                //is not forked
            }
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/branches/main' && order === enableOrder && repoForked === false) {



                interceptedRequest.respond({
                    status: 404,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            //is forked
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/branches/main' && order ===enableOrder && repoForked === true) {



                interceptedRequest.respond({
                    status: 200,
                    ok: true,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            //is forked
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/branches/main' && (order !==enableOrder)) {



                interceptedRequest.respond({
                    status: 200,
                    ok: true,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            //fork 
            else if (url === 'https://api.github.com/repos/webapis/workflow_runner/forks' && order === enableOrder) {
                repoForked = true


                interceptedRequest.respond({
                    status: 202,
                    statusText: "",
                    ok: true,
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            //action is not enabled
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/actions/workflows/aggregate.yml' && order === enableOrder && global.actionEnabled === false) {



                interceptedRequest.respond({
                    status: 404,
                    ok: false,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            //action is enabled
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/actions/workflows/aggregate.yml' && order === enableOrder && global.actionEnabled === true) {



                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/actions/workflows/aggregate.yml' && (order !== enableOrder)) {

                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }
            //enable action
            else if (url === 'https://github.com/codergihub/workflow_runner/actions') {

                global.actionEnabled = true;
                
                interceptedRequest.respond({ status: 302, headers: { Location: 'https://localhost:8888/pages/workspace-tasks/workspace-tasks.html' } })

            }
            //merge repo
            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/merge-upstream') {



                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }

            else {
                interceptedRequest.continue();
            }
}




module.exports = { gitHubInterceptor }