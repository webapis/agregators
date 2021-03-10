/* eslint-disable no-useless-catch */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
module.exports = async function ({ pageUrl, saveToUrl }) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const content = await page.content();

    fs.writeFileSync(path.join(process.cwd(), saveToUrl), content, {
      encoding: 'utf8',
    });

    await browser.close();
  } catch (error) {
    throw error;
  }
};
