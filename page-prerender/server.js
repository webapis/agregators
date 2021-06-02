const puppeteer = require('puppeteer');
const express = require('express');
const { pages } = require('./pages');
const staticApp = express();
staticApp.use(express.static('page-build'));

staticApp.listen(8081, async () => {
  console.log('Static Server started........... Press Ctrl+C to quit');
  const browser = await puppeteer.launch({ headless: true });
  await Promise.all(
    pages.map(async p => {
      const { pagePrerenderFunc, selector, input } = p;
      const { pagePrerender } = require(pagePrerenderFunc);

      await pagePrerender({ input, selector, browser });
    })
  );
  console.log('prerender complete....');
  await browser.close();
  process.exit();
});