require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');


const debuggedOrder = 411
const log = true
global.success = 0
Given('user clicks to button with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {
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
        // await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });


        // if(process.env.gh_action==='true'){
        //     const artifactName =`${order}-success-${id}.png`
        //     const files =[`screenshots/${order}-success-${id}.png`]
        //     console.log('process.env.gh_action......',process.env.gh_action)
        //     const artifactClient = artifact.create()
        //     const uploadResponse = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options)
        //     console.log('uploadResponse',uploadResponse)
        // }

        log && console.log(`${order}_success_|_user clicked.......`, id)

    } catch (error) {
        debugger;
        //   await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        // log && console.log(`${order}_failed_|_user clicked.......`, error)
        throw error

    }


})


Given('user types {string} to input with {string} selector {int}', { timeout: 15000 }, async function (value, id, order) {
    try {

        if (order === debuggedOrder) {
            debugger;
        }

        await global.page.waitForSelector(id)


        if (value === "password") {

            await global.page.type(id, process.env.githubpass ? process.env.githubpass : process.env.GITHUBPASS)
            //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
            log && console.log(`${order}_success_|_user types.......password`, id)
        } else {

            await global.page.type(id, value)
            //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
            log && console.log(`${order}_success_|_user types.......${value}`, id)
        }
        global.success++
    } catch (error) {
        debugger;
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        // log && console.log(`${order}_failed_|_user types .......${value}`, error)
        throw error
    }



})

Given('button with {string} selector is enabled {int}', { timeout: 15000 }, async function (id, order) {

    try {
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

        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log && console.log(`${order}_success_|_button enabled .......`, id)
        global.success++
    } catch (error) {
        debugger;
        //   await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        // log && console.log(`${order}_failed_|_button enabled .......`, error)
        throw error
    }

})
Given('user focuses on component with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {

        if (order === debuggedOrder) {
            debugger;
        }

        await global.page.waitForSelector(id)
        await global.page.focus(id)
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log && console.log(`${order}_success_|_user focused on .......`, id)
        global.success++
    } catch (error) {
        debugger;
        //   await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        //  log && console.log(`${order}_failed_|_user focused on .......`, error)
        throw error
    }

})
Given('component with {string} selector is visible to user {int}', { timeout: 15000 }, async function (id, order) {
    try {
        if (order === debuggedOrder) {
            debugger;
        }

        await global.page.waitForSelector(id)
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        if (order === debuggedOrder) {
            debugger;
        }

        log && console.log(`${order}_success_|_component is visible .......`, id)
        if (order === debuggedOrder) {
            debugger;
        }
        global.success++
    } catch (error) {

        //   await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        //  log && console.log(`${order}_failed_|_component is visible .......`, error)
        debugger;
        throw error
    }

})


Then('page is navigated to {string} url {int}', { timeout: 15000 }, async function (url, order) {

    try {

        if (order === debuggedOrder) {
            debugger;
        }
        debugger;
        const pageUrl = await global.page.evaluate(() => window.location.href)
        const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)
        // await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-nav.png` });
        assert.equal(actualUrl, url)
        log && console.log(`${order}_success_|_page is navigated to .......${url}`)
        global.success++
    } catch (error) {
        debugger;
        // await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-nav.png` });
        //  log && console.log(`${order}_falied_|_page is navigated to .......${url}`, error)
        throw error
    }

})

Given('user selects {string} from {string} select tag {int}', { timeout: 15000 }, async function (value, id, order) {
    try {

   
        await global.page.waitFor(2000);

        await global.page.select(`select${id}`, value)
        if (order === debuggedOrder) {
            debugger;
        }
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log && console.log(`${order}_success_|_user selects.......${value}`, id)
        global.success++
    } catch (error) {
        debugger;
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        //  log && console.log(`${order}_failed_|_user selects.......${value}`, error)
        throw error
    }




})

Given('component with {string} id includes {string} textcontent {int}', { timeout: 15000 }, async function (id, value, order) {
    try {
        if (order === debuggedOrder) {
            debugger;
        }
        await global.page.waitForSelector(id, { visible: true });

        const matchesTextCotnent = await global.page.evaluate((_id, _value) => document.querySelector(_id).textContent.includes(_value), id, value)
        // await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        debugger;
        assert.equal(matchesTextCotnent, true)
        log && console.log(`${order}_success_|_component includes text content.......${value}`, id)
        global.success++
    } catch (error) {
        debugger;
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        //  log && console.log(`${order}_error_|_component includes text content.......${value}`, error)
        throw error
    }


})



Given('button with {string} selector is disabled {int}', { timeout: 15000 }, async function (id, order) {

    try {
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
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log && console.log(`${order}_success_|_button disabled .......`, id)
        global.success++
    } catch (error) {
        debugger;
        //   await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        // log && console.log(`${order}_failed_|_button enabled .......`, error)
        throw error
    }

})


Given('wait for {int} seconds {int}', { timeout: 15000 }, async function (seconds, order) {
    try {
        debugger;
        await global.page.waitFor(seconds);
        log && console.log(`${order}_success_|_wait for ${seconds}seconds .......`)
        global.success++
    } catch (error) {
        throw error
    }


})

Given('page is navigated to {string} {int}', { timeout: 15000 }, async function (value, order) {

    try {
        if (order === debuggedOrder) {
            debugger;
        }


   
       await page.goto(value);
      
    
        if (order === debuggedOrder) {
            debugger;
        }
        //  await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        log && console.log(`${order}_success_|_page is navigated to`, value)
        global.success++
    } catch (error) {
        debugger;
        //   await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        // log && console.log(`${order}_failed_|_button enabled .......`, error)
        throw error
    }

})

/*
      - name: Archive production artifacts
        uses: actions/upload-artifact@v2
                with:
          name: screenshots
          path: |
            screenshots
*/