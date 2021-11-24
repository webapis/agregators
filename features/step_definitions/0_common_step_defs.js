require('dotenv').config()
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
Given('user clicks to button with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {
        await global.page.waitForSelector(id)
        await global.page.click(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        console.log(`${order}_success_|_user clicked.......`, id)
        process.exit(1)
        debugger;
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_failed_|_user clicked.......`, id)
        process.exit(1)
    }


})


Given('user types {string} to input with {string} selector {int}', { timeout: 15000 }, async function (value, id, order) {
    try {
        await global.page.waitForSelector(id)

        await global.page.type(id, value)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        console.log(`${order}_success_|_user types .......${value}`, id)


    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_failed_|_user types .......${value}`, id)
        process.exit(1)
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
        console.log(`${order}_success_|_button enabled .......`, id)
        debugger;
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_failed_|_button enabled .......`, id)
        process.exit(1)
    }

})
Given('user focuses on component with {string} selector {int}', { timeout: 15000 }, async function (id, order) {
    try {
        await global.page.waitForSelector(id)
        await global.page.focus(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        console.log(`${order}_success_|_user focused on .......`, id)
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_failed_|_user focused on .......`, id)
        process.exit(1)
    }





})
Given('component with {string} selector is visible to user {int}', { timeout: 15000 }, async function (id, order) {
    try {
        debugger;
        await global.page.waitForSelector(id)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        debugger;
        console.log(`${order}_success_|_component is visible .......`, id)
    } catch (error) {
        debugger;
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_failed_|_component is visible .......`, id)
        debugger;
        process.exit(1)
    }






})


Then('page is navigated to {string} url {int}', { timeout: 15000 }, async function (url, order) {

    try {
        const pageUrl = await global.page.evaluate(() => window.location.href)
        const actualUrl = pageUrl.substring(0, pageUrl.indexOf(url) + url.length)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-nav.png` });
        assert.equal(actualUrl, url)
        console.log(`${order}_success_|_page is navigated to .......${url}`, id)
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-nav.png` });
        console.log(`${order}_falied_|_page is navigated to .......${url}`, id)
        process.exit(1)
    }

})

Given('user selects {string} from {string} select tag {int}', { timeout: 15000 }, async function (value, id, order) {
    try {
        await global.page.waitFor(2000);

        await global.page.select(`select${id}`, value)
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-success-${id}.png` });
        console.log(`${order}_success_|_user selects.......${value}`, id)
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_failed_|_user selects.......${value}`, id)
        process.exit(1)
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
        console.log(`${order}_success_|_component includes text content.......${value}`, id)
    } catch (error) {
        await global.page.screenshot({ path: `${process.cwd()}/screenshots/${order}-error-${id}.png` });
        console.log(`${order}_error_|_component includes text content.......${value}`, id)
        process.exit(1)
    }

    debugger;
})

