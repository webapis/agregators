require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
Given('user clicks to button with {string} selector',{ timeout: 30000 }, async function (id) {
    
    await global.page.waitForSelector(id)
    await global.page.click(id)
  
    
})


Given('user types {string} to input with {string} selector',{ timeout: 30000 }, async function (value, id) {
    
    await global.page.waitForSelector(id)
    if (value === "password") {
        await global.page.type(id, process.env.githubpass)
    } else {
        await global.page.type(id, value)
    }

    

})

Given('component with {string} selector is visible to user', { timeout: 30000 }, async function (id) {
    
    await global.page.waitForSelector(id)
    

})


Then('page is navigated to {string} url',{ timeout: 30000 }, async function (url) {

    
    const pageUrl = await global.page.evaluate(() => window.location.href)
    const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)
    
    assert.equal(actualUrl, url)
})