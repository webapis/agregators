const puppeteer = require('puppeteer');

const path = require('path');

async function prerender({ componentPath, items }) {
  const browser = await puppeteer.launch();
  const filename = path.basename(componentPath, '.js');
  const page = await browser.newPage();

  await page.addScriptTag({ path: componentPath });

  await page.setContent(`<${filename}></${filename}>`, {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForSelector(`${filename}`);

  const element = await page.$(`${filename}`);

  // await page.evaluate(
  //   (_items, _element) => {
  //     _element.items = _items;
  //   },
  //   items,
  //   element
  // );

  // await page.evaluate(() => {
  //   const elements = document.getElementsByTagName('script');
  //   for (var i = 0; i < elements.length; i++) {
  //     if (elements[i].type === '') {
  //       elements[i].parentNode.removeChild(elements[i]);
  //     }
  //   }
  // });
  //await page.waitForSelector('product-view')
  await page.waitFor(5000)
  const content = await page.content();
debugger;
  const removeParentTag = content
    .replace(`<${filename}>`, '')
    .replace(`</${filename}>`, '');
  // debugger;
  // await makeDir(output);
  await page.close();
  await browser.close();
  return removeParentTag;
  //fs.writeFileSync(path.join(output, `${pageName}.html`), removeParentTag);
}

module.exports = {
  prerender
};
