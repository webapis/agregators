require('dotenv').config();
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
async function prerender({
  browser,
  componentPath,
  output,
  pageName,
  items
}) {
  debugger;
  const filename = path.basename(componentPath, '.js');
  const page = await browser.newPage();
  debugger;
  await page.addScriptTag({ path: componentPath });
  debugger;
  await page.setContent(`<${filename}></${filename}>`, {
    waitUntil: 'domcontentloaded'
  });
  debugger;
  await page.waitForSelector(`${filename}`);
  debugger;

  const element = await page.$(`${filename}`);
  debugger;
  await page.evaluate(
    (_items, _element) => {
      _element.items = _items;
    },
    items,
    element
  );

  // await page.evaluate(() => {
  //   const elements = document.getElementsByTagName('script');
  //   for (var i = 0; i < elements.length; i++) {
  //     if (elements[i].type === '') {
  //       elements[i].parentNode.removeChild(elements[i]);
  //     }
  //   }
  // });
  const content = await page.content();
  debugger;
  debugger;
  const removeParentTag = content
    // .replace(`<${filename}>`, '')
    // .replace(`</${filename}>`, '');
  debugger;
  await makeDir(output);
  debugger;
  fs.writeFileSync(path.join(output, `${pageName}.html`), removeParentTag);
}

module.exports = {
  prerender
};
