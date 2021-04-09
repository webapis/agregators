const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const { pages } = require('../../pages');
const staticApp = express();
staticApp.use(express.static('page-build'));
staticApp.listen(8080, async () => {
  console.log('Static Server started........... Press Ctrl+C to quit');
  const browser = await puppeteer.launch({ headless: true });
  await Promise.all(
    pages.map(async p => {
      const { pageName, selector } = p;

      const outputDirPath = `page-build${pageName}`;
      const outputDir = path.dirname(outputDirPath);

      await makeDir(outputDir);

      try {
        const page = await browser.newPage();
        await page.goto(`http://localhost:8080${pageName}`, {
          waitUntil: 'networkidle0'
        });

        await page.waitForSelector(selector); // ensure #posts exists in the DOM.

        const html = await page.content(); // serialized HTML of page DOM.

        fs.writeFileSync(`${process.cwd()}/${outputDirPath}`, html);
      } catch (error) {}
    })
  );
  console.log('prerender complete....');
  await browser.close();
  process.exit();
});
