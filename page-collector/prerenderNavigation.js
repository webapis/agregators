const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs');
const { walkSync } = require('./walkSync');

const puppeteer = require('puppeteer');
const express = require('express');
const staticApp = express();



async function prerenderNavigation({ taskSequelizerEventEmitter }) {
    
    staticApp.use(express.static('page-build'));

    staticApp.listen(8081, async () => {
        console.log('prerender started.....');
        const browser = await puppeteer.launch({ headless: false });

        await ssr({ browser })

        console.log('prerender complete....');
        taskSequelizerEventEmitter && taskSequelizerEventEmitter.emit('taskComplete', 'page_prerender')
        await browser.close();
        process.exit(0);
    });
}


async function ssr({ browser }) {

    
    const outputDirPath = `${process.cwd()}/page-build/components/nav-component.js`;
    const outputDirPath2 = `${process.cwd()}/page-prerendered/components/nav-component.js`;
    const outputDir = path.dirname(outputDirPath);
    const outputDir2 = path.dirname(outputDirPath2);
    
    await makeDir(outputDir);
    await makeDir(outputDir2);
    try {
        
        const page = await browser.newPage();
        await page.goto(`http://localhost:8081/moda.html`, {
            waitUntil: 'networkidle0'
        });
         await page.waitForSelector('.side-nav'); // ensure #posts exists in the DOM.
        const html = await  page.evaluate(() => document.querySelector('nav-component').outerHTML); // serialized HTML of page DOM.
        
        fs.writeFileSync(
            `${outputDirPath}`,
            html
        );
        fs.writeFileSync(
            `${outputDirPath2}`,
            html
        );
        
    } catch (error) {
        
    }



}

module.exports = {
    prerenderNavigation
};