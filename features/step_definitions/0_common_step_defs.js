require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const artifact = require('@actions/artifact');
const artifactClient = artifact.create()
const debuggedOrder=416
const log =true
const rootDirectory = `${process.cwd()}/screenshots` // Also possible to use __dirname
const options = {
    continueOnError: false
}
Given('user clicks to button with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {
        if (order ===debuggedOrder) {
            debugger;
        }
        await global.page.waitForSelector(id)
        await global.page.click(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        const artifactName =`${order}-success-${id}.png`
        const files =[`/${order}-success-${id}.png`]
        if(process.env.gh_action===true){
            const uploadResponse = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options)
            console.log('uploadResponse',uploadResponse)
        }
   
        log&&   console.log(`${order}_success_|_user clicked.......`, id)

    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&    console.log(`${order}_failed_|_user clicked.......`, id)
       process.exit(1)
    }


})


Given('user types {string} to input with {string} selector {int}', { timeout: 15000 }, async function (value, id, order) {
    try {

        if (order ===debuggedOrder) {
            debugger;
        }
      
        await global.page.waitForSelector(id)


        if (value === "password") {

            await global.page.type(id, process.env.githubpass ? process.env.githubpass : process.env.GITHUBPASS)
            await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
            log&&     console.log(`${order}_success_|_user types.......password`, id)
        } else {

            await global.page.type(id, value)
            await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
            log&&    console.log(`${order}_success_|_user types.......${value}`, id)
        }

    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&   console.log(`${order}_failed_|_user types .......${value}`, id)
      //  process.exit(1)
    }



})

Given('button with {string} selector is enabled {int}', { timeout: 15000 }, async function (id, order) {

    try {
        if (order ===debuggedOrder) {
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
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log&&   console.log(`${order}_success_|_button enabled .......`, id)

    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&   console.log(`${order}_failed_|_button enabled .......`, id)
       // process.exit(1)
    }

})
Given('user focuses on component with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {

        if (order ===debuggedOrder) {
            debugger;
        }
       
        await global.page.waitForSelector(id)
        await global.page.focus(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log&&     console.log(`${order}_success_|_user focused on .......`, id)

    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&    console.log(`${order}_failed_|_user focused on .......`, id)
      //  process.exit(1)
    }





})
Given('component with {string} selector is visible to user {int}', { timeout: 15000 }, async function (id, order) {
    try {
        if (order ===debuggedOrder) {
            debugger;
        }
     
        await global.page.waitForSelector(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });

        log&&   console.log(`${order}_success_|_component is visible .......`, id)
    } catch (error) {

        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&    console.log(`${order}_failed_|_component is visible .......`, id)
        debugger;
      //  process.exit(1)
    }






})


Then('page is navigated to {string} url {int}', { timeout: 15000 }, async function (url, order) {

    try {

        if (order ===debuggedOrder) {
            debugger;
        }
        const pageUrl = await global.page.evaluate(() => window.location.href)
        const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-nav.png` });
        assert.equal(actualUrl, url)
        log&&     console.log(`${order}_success_|_page is navigated to .......${url}`)

    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-nav.png` });
        log&&    console.log(`${order}_falied_|_page is navigated to .......${url}`)
       // process.exit(1)
    }

})

Given('user selects {string} from {string} select tag {int}', { timeout: 15000 }, async function (value, id, order) {
    try {

        if (order ===debuggedOrder) {
            debugger;
        }
        await global.page.waitFor(2000);

        await global.page.select(`select${id}`, value)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log&&     console.log(`${order}_success_|_user selects.......${value}`, id)

    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&     console.log(`${order}_failed_|_user selects.......${value}`, id)
       // process.exit(1)
    }




})

Given('component with {string} id includes {string} textcontent {int}', async function (id, value, order) {
    try {
        if (order ===debuggedOrder) {
            debugger;
        }
        await global.page.waitFor(2000);
        const matchesTextCotnent = await global.page.evaluate((_id, _value) => document.querySelector(_id).textContent.includes(_value), id, value)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });

        assert.equal(matchesTextCotnent, true)
        log&&    console.log(`${order}_success_|_component includes text content.......${value}`, id)
    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        log&&    console.log(`${order}_error_|_component includes text content.......${value}`, id)
        process.exit(1)
    }


})

Given('user navigates to ${string} ${int}', async function (url, order) {
    try {

        if (order ===debuggedOrder) {
            debugger;
        }

        await global.page.goto(url)

        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${url}.png` });
        log&&    console.log(`${order}_success_|_user navigates to.......${url}`)

    } catch (error) {
debugger;
        log&&     console.log(`${order}_error_|_user navigates to.......${url}`)
        process.exit(1)
    }
})