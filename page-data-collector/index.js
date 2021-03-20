const puppeteer = require('puppeteer');
const fs = require('fs');
const makeDir = require('make-dir');
async function pageDataCollector({ url, dataCollector, pageUrlsGetter }) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const pageUrls = await pageUrlsGetter({ page });
    const firstData = await dataCollector({ page });
    const data = await Promise.all(
      pageUrls.map(async pageUrls => {
        const page = await browser.newPage();
        await page.goto(pageUrls, { waitUntil: 'networkidle2' });
        const data = await dataCollector({ page });
        await page.close();
        return data;
      })
    );
    await page.close();
    await browser.close();

    const result = [
      ...firstData,
      ...data.reduce((acc, curr, i) => {
        if (i === 0) {
          return [...curr];
        }
        return [...acc, ...curr];
      }, [])
    ];
    const outputFolder = `${process.cwd()}/page-data/defacto/kadin`;
    await makeDir(outputFolder);
    const filePath = `${outputFolder}/kadin-jeans.json`;
    fs.writeFileSync(filePath, JSON.stringify(result));
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  pageDataCollector
};
