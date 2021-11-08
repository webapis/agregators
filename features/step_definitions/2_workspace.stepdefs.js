require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');


Given('Users is authenticated and is on home page',async function(){

    await global.page.waitForSelector('home-card > div > a',{timeout:60000})
    const workspacesBtnText=  await global.page.evaluate(function(){
        return document.querySelector('home-card > div > a').textContent   
    })
    
    assert.equal(workspacesBtnText,'Workspaces')
  
})

Given('user clicks to workspaces button',async function(){
debugger;
    await global.page.click('#Workspaces')
    debugger;

})