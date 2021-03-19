const puppeteer = require('puppeteer');
async function pageContentReader({ url, pageHandler, pageUrlsGetter }) {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const pageUrls = await pageUrlsGetter({ page });
    const firstData = await pageHandler({ page });
    const data = await Promise.all(
      pageUrls.map(async pageUrls => {
        const page = await browser.newPage();
        await page.goto(pageUrls, { waitUntil: 'networkidle2' });
        const data = await pageHandler({ page });
        await page.close();
        return data;
      })
    );

    await page.close();
    await browser.close();
    return Promise.resolve([firstData, ...data]);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  pageContentReader
};
