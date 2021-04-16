const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs');
async function pagePrerender({ input, browser, selector }) {
  debugger;
  const rawData = fs.readFileSync(input, { encoding: 'utf-8' });
  debugger;
  const dataObject = JSON.parse(rawData);

  await Promise.all(
    dataObject.map(async d => {
      const { url } = d;
      const outputDirPath = `page-build${url}`;
      const outputDir = path.dirname(outputDirPath);
      await makeDir(outputDir);
      try {
        const page = await browser.newPage();
        await page.goto(`http://localhost:8081${url}`, {
          waitUntil: 'networkidle0'
        });
        await page.waitForSelector(selector); // ensure #posts exists in the DOM.
        const html = await page.content(); // serialized HTML of page DOM.
        fs.writeFileSync(`${process.cwd()}/${outputDirPath}`, html);
      } catch (error) {
        debugger;
      }
    })
  );
}

module.exports = {
  pagePrerender
};
