const puppeteer = require('puppeteer');
async function pageContentReader({ url, pageHandler }) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.close();
    await browser.close();
    const data = await pageHandler({ page });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  pageContentReader
};
