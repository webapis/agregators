require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
Given('user clicks to button with {string} selector', { timeout: 15000 }, async function (id) {
    if(id==="#js-oauth-authorize-btn"){
        debugger;
    }
    await global.page.waitForSelector(id)
    await global.page.click(id)
    //   if(id==="#add-workflow-btn"){
    //    
    //   }

})


Given('user types {string} to input with {string} selector', { timeout: 15000 }, async function (value, id) {

    await global.page.waitForSelector(id)
    if (value === "password") {
        await global.page.type(id, process.env.githubpass ? process.env.githubpass:secrets.GITHUBPASS )
    } else {
        await global.page.type(id, value)
    }
    // if(id==='#taskname'){
    //     
    // }


})

Given('button with {string} selector is enabled',{ timeout: 15000 },async function(id){
    debugger;
    const rect = await global.page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const { x, y } = element.getBoundingClientRect();
        return { x, y };
      }, id);
      await global.page.mouse.click(rect.x, rect.y, { clickCount: 2 ,delay:1000});
      debugger;
    await global.page.waitForSelector(`button${id}:not([disabled])`);
    debugger;
})
Given('user focuses on component with {string} selector', { timeout: 15000 }, async function (id) {
    if (id === '#repoDataList') {

    }

    await global.page.waitForSelector(id)
    await global.page.focus(id)



})
Given('component with {string} selector is visible to user', { timeout: 15000 }, async function (id) {

    await global.page.waitForSelector(id)
    // if (id === "#workspace") {
    //     await global.page.waitFor(4000)
    //     const authorizebtn = await global.page.$("#js-oauth-authorize-btn")
    //     if (authorizebtn) {
    //         debugger;
    //         await global.page.click("#js-oauth-authorize-btn")
    //     } else {
    //         debugger;
    //         await global.page.waitForSelector(id)
    //     }
    // } else {
    //     debugger;
    //     await global.page.waitForSelector(id)

    // }
    if(id==="#js-oauth-authorize-btn"){
        debugger;
    }

   



})


Then('page is navigated to {string} url', { timeout: 15000 }, async function (url) {


    const pageUrl = await global.page.evaluate(() => window.location.href)
    const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)

    assert.equal(actualUrl, url)
})

Given('user selects {string} from {string} select tag', { timeout: 15000 }, async function (value, id) {

    await global.page.waitFor(2000);

    await global.page.select(`select${id}`, value)



})

Given('component with {string} id includes {string} textcontent', async function (id, value) {
    debugger;
    await global.page.waitFor(2000);
    const matchesTextCotnent = await global.page.evaluate((_id, _value) => document.querySelector(_id).textContent.includes(_value), id, value)
    debugger;
    assert.equal(matchesTextCotnent, true)
    debugger;
})