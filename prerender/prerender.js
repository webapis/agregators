require('dotenv').config();
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
async function prerender({ req }) {
  const { componentPath, output, pageName, items } = req.body;

  const filename = path.basename(componentPath, '.js');
  const page = await req.browser.newPage();
 
  await page.addScriptTag({ path: componentPath });
  
  await page.setContent(`<${filename}></${filename}>`, {
    waitUntil: 'domcontentloaded',
  });

 
  await page.waitForSelector('#root');
  debugger;

  await page.evaluate((_items) => {
    document.getElementById('container').items = _items;
  }, items);

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
    .replace(`<${filename} id="container">`, '')
    .replace(`</${filename}>`, '');

  await makeDir(output);

  fs.writeFileSync(path.join(output, `${pageName}.html`), removeParentTag);
}

module.exports = {
  prerender,
};
