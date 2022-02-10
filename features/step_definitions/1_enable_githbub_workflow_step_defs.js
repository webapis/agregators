require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');


const debuggedOrder = 311
const log = true

Given('user is on page workspace-tasks.html {int}', { timeout: 15000 }, async function (order) {
    try {


        await global.page.setRequestInterception(true);
        let counter = 0
        let countAgregate = 0
        global.page.on('request', (interceptedRequest) => {
            const url = interceptedRequest._url


            if (url === 'https://api.github.com/repos/codergihub/workflow_runner/branches/main' && counter === 0) {
           
                counter++
                interceptedRequest.respond({
                    status: 404,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }

            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/branches/main' && counter === 1) {
           
                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'mock 3',

                })
            }

            else if (url === 'https://api.github.com/repos/codergihub/workflow_runner/actions/workflows/aggregate.yml') {
             
                if (countAgregate === 0) {
                    countAgregate++
                   
                    interceptedRequest.respond({
                        status: 404,
                        statusText: "",
                        contentType: 'application/json',
                        body: 'mock 3',

                    })

                } else {
                    interceptedRequest.respond({
                        status: 200,
                        statusText: "",
                        contentType: 'application/json',
                        body: 'mock 3',

                    })
                }



            } else if (url === 'https://api.github.com/repos/webapis/workflow_runner/forks') {
                
                interceptedRequest.respond({
                    status: 202,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'Accepted',

                })
            }
            else if (url === `https://api.github.com/repos/codergihub/workflow_runner/merge-upstream`) {
                
                interceptedRequest.respond({
                    status: 200,
                    statusText: "",
                    contentType: 'application/json',
                    body: 'Accepted',

                })
            }
            else {
                interceptedRequest.continue();
            }



        })


        if (order === debuggedOrder) {
            
        }
     
        await global.page.goto(`https://localhost:8888/workspace-tasks.html`)
     
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${url}.png` });
        log && console.log(`${order}_success_|_user is on page workspace-tasks.html`)
        global.success++
    } catch (error) {
        
        //  log && console.log(`${order}_error_|_user navigates to.......${url}`, error)
        throw error
    }
})

Given('user moves to page workspace-tasks.html tab {int}', { timeout: 15000 }, async function (order) {
    try {
        await global.page.goto(`https://localhost:8888/workspace-tasks.html`)
        await global.page.bringToFront()
        log && console.log(`${order}_success_|_user moves to page workspace-tasks.html`)
        
        global.success++

    } catch (error) {
        throw error
    }

})