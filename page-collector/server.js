const puppeteer = require('puppeteer');
const { pages } = require('./pages');

async function batchPageCollector() {
  const browser = await puppeteer.launch({ timeout: 50000 });
  pages.map(async p => {

    const { input, pageCollectorFunc, output } = p;
    console.log('pageCollector started', input);
    const { pageCollector } = require(pageCollectorFunc);
    await pageCollector({
      input,
      output,
      browser
    });
    console.log('pageCollector ended', output);
  });
}

batchPageCollector();
