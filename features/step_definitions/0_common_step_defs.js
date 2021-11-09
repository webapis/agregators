require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
Given('user clicks to button with {string} selector',{ timeout: 15000 }, async function (id) {
    
    await global.page.waitForSelector(id)
    await global.page.click(id)
  if(id==="#add-workflow-btn"){
   debugger;
  }
    
})


Given('user types {string} to input with {string} selector',{ timeout: 15000 }, async function (value, id) {
    
    await global.page.waitForSelector(id)
    if (value === "password") {
        await global.page.type(id, process.env.githubpass)
    } else {
        await global.page.type(id, value)
    }
// if(id==='#taskname'){
//     debugger;
// }
    

})
Given('user focuses on component with {string} selector',{ timeout: 15000 }, async function (id) {
    if(id==='#repoDataList'){
        debugger;
    }
        
       await global.page.waitForSelector(id)
        await global.page.focus(id)
   


})
Given('component with {string} selector is visible to user', { timeout: 15000 }, async function (id) {
    
    await global.page.waitForSelector(id)
    // if(id==="#tasks a[name='Task 1']"){
    //     debugger;
    // }
    

})


Then('page is navigated to {string} url',{ timeout: 15000 }, async function (url) {

    
    const pageUrl = await global.page.evaluate(() => window.location.href)
    const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)
    
    assert.equal(actualUrl, url)
})