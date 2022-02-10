require('dotenv').config()

const { Given } = require('@cucumber/cucumber');
const fs = require('fs')

const debuggedOrder = 606
const log = true

async function mockGithubBranchesAndRepos(order) {
    try {


        const bodyRepos = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/repos.json`)
        const bodyBranches = fs.readFileSync(`${process.cwd()}/mock-data/git-repos/branches.json`)
        await global.page.setRequestInterception(true);

        global.page.on('request', (interceptedRequest) => {
            const url = interceptedRequest._url

            if (url === 'https://api.github.com/user/repos') {
         

                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: bodyRepos,

                })

            } else if (url === 'https://api.github.com/repos/codergihub/moda/branches') {
            
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
            else {
          
                interceptedRequest.continue();
            }



        })




        // await global.page.goto(`https://localhost:8888/workflow-editor.html`)

        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${url}.png` });
        log && console.log(`${order}_success_|_mock_github_repos_and_branches`)
        global.success++
    } catch (error) {
        debugger;
        //  log && console.log(`${order}_error_|_user navigates to.......${url}`, error)
        throw error
    }
}

module.exports = { mockGithubBranchesAndRepos }
