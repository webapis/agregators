const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
async function pageDataCollector({
  url,
  dataCollector,
  pageUrlsGetter,
  output
}) {
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

    await makeDir(path.dirname(output));
    const modImageSrc = result.map(r => {
      const { image: { scrset } } = r;
      const sourceImage = scrset.substring(0, scrset.indexOf('525w'));
      const imageOne = `${sourceImage}525w,`;
      const imageTwo = `${sourceImage.replace('/252/', '/304/')}773w,`;
      const imageThree = `${sourceImage.replace('/252/', '/320/')}2000w,`;
      const imageFour = `${sourceImage.replace('/252/', '/376/')}3000w`;
      const modsrcset = imageOne + imageTwo + imageThree + imageFour;

      return { ...r, image: { ...r.image, scrset: modsrcset } };
  
    });
  
    fs.writeFileSync(output, JSON.stringify(modImageSrc));
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  pageDataCollector
};
