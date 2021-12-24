require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('user navigates to task-runner.html page {int}',async function(order){
    try {

        // await global.page.setRequestInterception(true);
        // global.page.on('request', (interceptedRequest) => {

        //     const url = interceptedRequest._url
        //     if (url.includes('https://accounts.google.com/o/oauth2/v2/auth?scope=')) {
        //         console.log('url', url)
        //         debugger;
        //   interceptedRequest.continue({url:'https://localhost:8888/google-auth-callback'})
          
          
        //     } else if(url.includes('authorization_code')){
        //         debugger;
        //         interceptedRequest.respond({
        //             status: 200,
        //             statusText: "",
        //             contentType: 'application/json',
        //             body: JSON.stringify({
        //                 access_token: "ya29.a0ARrdaM-XDqqUQYRRviXeYuEZKR_jPLWYjFgLzSfOH_SZL5_snxs_MN6k2W9_47kzP5xbXSb3m4wCXbgEYO6GcuUJDF7E3eUyl8lXBHIxZv17mex0Bx8xG0d5PUlbHoFwFzClBoBlR4WnYLPiel_GgQ5zNI5r",
        //                 expires_in: 3599,
        //                 refresh_token: "1//09DH2oyMTB7j3CgYIARAAGAkSNwF-L9IrDY9sO2i21DQ-qGcXWeBhjL8aa9VCLce0Jw7nUzD7JPvNlgJVltVwRWyrXInNIeHd84Y",
        //                 scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive",
        //                 token_type: "Bearer",
        //             })
        //         })
        //     } else if(url.includes('https://localhost:8888/.netlify/functions/google-auth-callback')){
        //         debugger;
        //         console.log('url', url)
        //         interceptedRequest.continue();
        //     }
          
        //      else{
        //         interceptedRequest.continue();
        //     }

        
          
        // })
debugger;
        await global.page.goto('https://localhost:8888/task-runner.html')
        debugger;
        console.log(`${order}_success_|_user navigated to task-runner.html page`)
        global.success++

    } catch (error) {
        debugger;
        throw error
    }
})