require('dotenv').config();
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
async function prerender({ req }) {
  try {
    const { componentPath, output, pageName, items } = req.body;
    debugger;
    console.log(req.body);
    const filename = path.basename(componentPath, '.js');
    const page = await req.browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
      if (request.url() === 'http://localhost:3000/buildstart') {
        debugger;
        request.response({
          content: 'application/json',
          body: JSON.stringify(items),
        });
      }
      if (request.url() === 'http://localhost:3000/buildend') {
        debugger;
        await page.evaluate(() => {
          const elements = document.getElementsByTagName('script');
          for (var i = 0; i < elements.length; i++) {
            if (elements[i].type === '') {
              elements[i].parentNode.removeChild(elements[i]);
            }
          }
        });
        const content = await page.content();
        debugger;
        const removeParentTag = content
          .replace(`<${filename}>`, '')
          .replace(`</${filename}>`, '');
        debugger;
        const pathMade = await makeDir(output);
        debugger;
        fs.writeFileSync(
          path.join(output, `${pageName}.html`),
          removeParentTag
        );
      }
      debugger;
    });
    debugger;
    await page.addScriptTag({ path: componentPath });
    await page.setContent(`<${filename}></${filename}>`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('#root');

    debugger;
  } catch (error) {
    debugger;

    throw error;
  }
}

module.exports = {
  prerender,
};
/*
const fs = require('fs');
const path = require('path');
async function renderPage ({items, browser}){
    filePaths.map(async (filePath) => {
      const filename = path.basename(filePath, '.js');
      const page = await this.browser.newPage();
      await page.addScriptTag({ path: filePath });
      await page.setContent(`<${filename}></${filename}>`, {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForSelector('#root');
      debugger;
      await page.evaluate(() => {
        const elements = document.getElementsByTagName('script');
        for (var i = 0; i < elements.length; i++) {
          if (elements[i].type === '') {
            elements[i].parentNode.removeChild(elements[i]);
          }
        }
      });
      const content = await page.content();
      const removeParentTag = content
        .replace(`<${filename}>`, '')
        .replace(`</${filename}>`, '');
      fs.writeFileSync(path.join(dest, `${filename}.html`), removeParentTag);
      debugger;
}
*/
