const puppeteer = require('puppeteer');
async function pageContentReader({ url }) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const pageTitle = await page.title();
    await page.close();
    await browser.close();
    return Promise.resolve(pageTitle);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  pageContentReader
};
