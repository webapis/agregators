require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
//User Authentication exists


Given('Users sees Sign in button',async function(){

await this.page.waitForSelector('home-card > div > a')
const signinbtnText=  await this.page.evaluate(function(){
    return document.querySelector('home-card > div > a').textContent   
})

assert.equal(signinbtnText,'Sign in')

})

When('User clicks on Sign in button',{timeout:10000},async function(){

        await this.page.click('home-card > div > a')
})
Then('User is navigated to github auth page',async function(){
    const pageUrl = await this.page.evaluate(()=>window.location.href)
    const actualUrl =pageUrl.substring(0,pageUrl.indexOf('login?')+6)
    assert.equal(actualUrl,'https://github.com/login?')
  

})

//User Authenticates with github

Given('user enters correct username and password',async function(){


    await this.page.waitForSelector('#login_field')
        await this.page.type('#login_field','serdartkm')
        await this.page.type('#password',process.env.githubpass)
    
})

Given('user clicks Github Sign in button',async function(){

    await this.page.click('div > input.btn.btn-primary.btn-block.js-sign-in-button')
  

})



Then('Workspace button is visible to the user',{timeout:60000},async function(){
    debugger;
    await this.page.waitForSelector('home-card > div > a',{timeout:60000})
    const workspacesBtnText=  await this.page.evaluate(function(){
        return document.querySelector('home-card > div > a').textContent   
    })
    
    assert.equal(workspacesBtnText,'Workspaces')
    debugger;
})
Then('Username is displayed at the top',async function(){

    debugger;
})