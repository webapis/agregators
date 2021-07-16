const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs');
const { walkSync } = require('./walkSync');

const puppeteer = require('puppeteer');
const express = require('express');
const staticApp = express();



async function pagePrerender({taskSequelizerEventEmitter}){
    debugger;
    staticApp.use(express.static('page-build'));

    staticApp.listen(8081, async () => {
      console.log('prerender started.....');
      const browser = await puppeteer.launch({ headless: true });
    
     await ssr({browser})
    
      console.log('prerender complete....');
      taskSequelizerEventEmitter && taskSequelizerEventEmitter.emit('taskComplete', 'page_prerender')
      await browser.close();
      process.exit(0);
    });
}


async function ssr({ browser}) {
   
    debugger;
    let files =[]

  walkSync(`${process.cwd()}/page-build/`, async filepath => {
      files.push(filepath)
  });
 const htmlPages =files.filter(f=>  path.extname(f)==='.html')

  await Promise.all(
    htmlPages.map(async d => {
    
      const url =d.substring(d.indexOf('page-build')+11)
      const outputDirPath = `${process.cwd()}/page-build/${url}`;
      const outputDirPath2= `${process.cwd()}/page-prerendered/${url}`;
      const outputDir = path.dirname(outputDirPath);
      const outputDir2 = path.dirname(outputDirPath2);
      debugger;
      await makeDir(outputDir);
      await makeDir(outputDir2);
      try {
          debugger;
        const page = await browser.newPage();
        await page.goto(`http://localhost:8081/${url}`, {
          waitUntil: 'networkidle0'
        });
        await page.waitForFunction('document.getElementById("products")'); // ensure #posts exists in the DOM.
        debugger;
        const html = await page.content(); // serialized HTML of page DOM.
        fs.writeFileSync(
            `${outputDirPath}`,
            html
          );
        fs.writeFileSync(
            `${outputDirPath2}`,
            html
          );
          debugger;
      } catch (error) {
        debugger;
      }
    })
  );

}

module.exports = {
  pagePrerender
};