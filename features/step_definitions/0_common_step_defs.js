require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');


const debuggedOrder = 501
const log = true
global.success = 1
const timeout = 15000

Given('user clicks to button with {string} selector {int}', { timeout }, async function (id, order) {

    if (order === debuggedOrder) {
        debugger;
    }
    await global.page.waitForSelector(id)
    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.click(id)
    if (order === debuggedOrder) {
        debugger;
    }   
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
    log && console.log(`${order}_success_|_user clicked.......`, id)


})

Given('user reloads page {int}', { timeout }, async function ( order) {

    if (order === debuggedOrder) {
        debugger;
    }
    await global.page.reload()
    if (order === debuggedOrder) {
        debugger;
    }

   
    if (order === debuggedOrder) {
        debugger;
    }   
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
    log && console.log(`${order}_success_|_user reloads page.......`)


})

Given('user types {string} to input with {string} selector {int}', { timeout }, async function (value, id, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id)


    if (value === "password") {

        await global.page.type(id, process.env.githubpass ? process.env.githubpass : process.env.GITHUBPASS)

        log && console.log(`${order}_success_|_user types.......password`, id)
    } else {
        
        await global.page.type(id, value)


        log && console.log(`${order}_success_|_user types.......${value}`, id)
    }
    global.success++

    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('button with {string} selector is enabled {int}', { timeout }, async function (id, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    const rect = await global.page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const { x, y } = element.getBoundingClientRect();
        return { x, y };
    }, id);
    await global.page.mouse.click(rect.x, rect.y, { clickCount: 2, delay: 1000 });

    await global.page.waitForSelector(`button${id}:not([disabled])`);
    if (order === debuggedOrder) {
        debugger;
    }

    log && console.log(`${order}_success_|_button enabled .......`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('user focuses on component with {string} selector {int}', { timeout }, async function (id, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id)
    await global.page.focus(id)

    log && console.log(`${order}_success_|_user focused on .......`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });

})

Given('component with {string} selector is visible to user {int}', { timeout }, async function (id, order) {

    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id)

    if (order === debuggedOrder) {
        debugger;
    }

    log && console.log(`${order}_success_|_component is visible .......`, id)
    if (order === debuggedOrder) {
        debugger;
    }
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('selected value for {string} selector is {string} {int}', { timeout }, async function (id,value, order) {

    if (order === debuggedOrder) {
        debugger;
    }

    const option  = await page.evaluate((_id)=> {

        //If this form is nested more than the code you provided then just go to the element in DevTools > right click > copy > full JS path.... This will give you the exact path the the form / form elements 
        var opts = document.querySelectorAll(`${_id} option`);
        var selected;
        //Check if each option has the "selected" attribute or not 
        opts.forEach(opt => {
            if(opt.hasAttribute('selected')){
                selected = opt.textContent;
            }
        });

        return selected;
    },id);
    assert.equal(option,value)
 
    if (order === debuggedOrder) {
        debugger;
    }

    log && console.log(`${order}_success_|_component is visible .......`, id)
    if (order === debuggedOrder) {
        debugger;
    }
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('component with {string} selector contains {int} children {int}',{timeout},async function(id,length,order) {
    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id)

    if (order === debuggedOrder) {
        debugger;
    }

    const children = await global.page.evaluate((_id) => Array.from(document.querySelector(_id).children), id)

    assert.equal(children.length,length)
 
    log && console.log(`${order}_success_|_child length is ${children.length} .......`, id)
    if (order === debuggedOrder) {
        debugger;
    }
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Then('page is navigated to {string} url {int}', { timeout }, async function (url, order) {



    if (order === debuggedOrder) {
        debugger;
    }
    debugger;
    const pageUrl = await global.page.evaluate(() => window.location.href)
    const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)

    assert.equal(actualUrl, url)
    log && console.log(`${order}_success_|_page is navigated to .......${url}`)
    global.success++

    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('user selects {string} from {string} select tag {int}', { timeout }, async function (value, id, order) {

    if (order === debuggedOrder) {
        debugger;
    }
    await global.page.select(`select${id}`, value)
    if (order === debuggedOrder) {
        debugger;
    }

    log && console.log(`${order}_success_|_user selects.......${value}`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})



Given('component with {string} id includes {string} textcontent {int}', { timeout }, async function (id, value, order) {

    if (order === debuggedOrder) {
        debugger;
    }
    await global.page.waitForSelector(id, { visible: true });

    const matchesTextCotnent = await global.page.evaluate((_id, _value) => document.querySelector(_id).textContent.includes(_value), id, value)


    assert.equal(matchesTextCotnent, true)
    log && console.log(`${order}_success_|_component includes text content.......${value}`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('input with {string} id includes {string} value {int}', { timeout }, async function (id, value, order) {

    if (order === debuggedOrder) {
        debugger;
    }
    
    await global.page.waitForSelector(id);

    const matchesTextCotnent = await global.page.evaluate((_id,_value) => document.querySelector(_id).value.includes(_value), id,value)


    assert.equal(matchesTextCotnent, true)
    log && console.log(`${order}_success_|_input type includes text value.......${value}`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('clear input with {string} id {int}', { timeout }, async function (id, order) {

    if (order === debuggedOrder) {
        debugger;
    }
  
    await global.page.waitForSelector(id);

  await global.page.evaluate((_id) => {document.querySelector(_id).value=''}, id)



    log && console.log(`${order}_success_|_input cleared.......`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('button with {string} selector is disabled {int}', { timeout }, async function (id, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id);
    const isDisabled = await page.$eval(id, (el) => el.disabled);
    assert.equal(isDisabled, true)
    debugger;
    if (order === debuggedOrder) {
        debugger;
    }
    log && console.log(`${order}_success_|_button disabled .......`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });

})

Given('component with {string} selector is disabled {int}', { timeout }, async function (id, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id);
    const isDisabled = await page.$eval(id, (el) => el.disabled);
    assert.equal(isDisabled, true)
    
    if (order === debuggedOrder) {
        debugger;
    }
    log && console.log(`${order}_success_|_component disabled .......`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });

})

Given('input with {string} selector is readonly {int}', { timeout }, async function (id, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    await global.page.waitForSelector(id);
    const readonly = await page.$eval(id, (el) => el.getAttribute('readonly'));

    assert.equal(readonly, 'true')
  
    if (order === debuggedOrder) {
        debugger;
    }
    log && console.log(`${order}_success_|_button disabled .......`, id)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });

})

Given('wait for {int} seconds {int}', { timeout }, async function (seconds, order) {

    debugger;

    log && console.log(`${order}_success_|_wait for ${seconds}seconds .......`)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
})

Given('page is navigated to {string} {int}', { timeout }, async function (value, order) {


    if (order === debuggedOrder) {
        debugger;
    }

    await page.goto(value);


    if (order === debuggedOrder) {
        debugger;
    }
    log && console.log(`${order}_success_|_page is navigated to`, value)
    global.success++
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });

})

Given('a tag with {string} selector opens in {string} target {int}', { timeout }, async function (selector, targetValue, order) {

    if (order === debuggedOrder) {

    }
    await global.page.waitForSelector(selector)

    await global.page.evaluate((_selector, _targetValue) => {
        document.querySelector(_selector).setAttribute('target', _targetValue)
    }, selector, targetValue)

    if (order === debuggedOrder) {
        debugger;
    }
    await global.page.click(selector)
    if (order === debuggedOrder) {
        debugger;
    }
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-${Date.now()}-success.png` });
    log && console.log(`${order}_success_|_a tag with${targetValue} opened`, selector)

})

