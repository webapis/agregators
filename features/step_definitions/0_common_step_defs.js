require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
Given('user clicks to button with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {
        await global.page.waitForSelector(id)
        await global.page.click(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        console.log('user clicked.......')
        debugger;
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
    }


})


Given('user types {string} to input with {string} selector {int}', { timeout: 15000 }, async function (value, id, order) {
    try {
        await global.page.waitForSelector(id)
        if (value === "password") {
            await global.page.type(id, process.env.githubpass ? process.env.githubpass : process.env.GITHUBPASS)
            await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        } else {
            await global.page.type(id, value)
            await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        }
        console.log('user typed.......')
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
    }



})

Given('button with {string} selector is enabled {int}', { timeout: 15000 }, async function (id, order) {

    try {
        debugger;
        const rect = await global.page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const { x, y } = element.getBoundingClientRect();
            return { x, y };
        }, id);
        await global.page.mouse.click(rect.x, rect.y, { clickCount: 2, delay: 1000 });
        debugger;
        await global.page.waitForSelector(`button${id}:not([disabled])`);
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        console.log('button enabled.......')
        debugger;
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });

    }

})
Given('user focuses on component with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {
        await global.page.waitForSelector(id)
        await global.page.focus(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
    }





})
Given('component with {string} selector is visible to user {int}', { timeout: 15000 }, async function (id, order) {
    try {
        debugger;
        await global.page.waitForSelector(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        debugger;
        if (id === "#js-oauth-authorize-btn") {
            debugger;
        }
        console.log('component is visible.......')
    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        debugger;
    }






})


Then('page is navigated to {string} url {int}', { timeout: 15000 }, async function (url, order) {

    try {
        const pageUrl = await global.page.evaluate(() => window.location.href)
        const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-nav.png` });
        assert.equal(actualUrl, url)
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-nav.png` });
    }

})

Given('user selects {string} from {string} select tag {int}', { timeout: 15000 }, async function (value, id, order) {
    try {
        await global.page.waitFor(2000);

        await global.page.select(`select${id}`, value)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
    }




})

Given('component with {string} id includes {string} textcontent {int}', async function (id, value, order) {
    try {
        debugger;
        await global.page.waitFor(2000);
        const matchesTextCotnent = await global.page.evaluate((_id, _value) => document.querySelector(_id).textContent.includes(_value), id, value)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        debugger;
        assert.equal(matchesTextCotnent, true)
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
    }

    debugger;
})