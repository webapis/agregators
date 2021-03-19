const puppeteer = require('puppeteer');
async function pageContentReader({ url }) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const pageTitle = await page.title();
  return Promise.resolve(pageTitle);
}

module.exports = {
  pageContentReader
};
