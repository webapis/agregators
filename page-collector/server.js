const { pages } = require('./pages');

async function batchPageCollector() {
  pages.map(async p => {
    const { input, pageCollectorFunc, output } = p;
    console.log('pageCollector started', input);
    const { pageCollector } = require(pageCollectorFunc);
    await pageCollector({
      ...p
    });
    console.log('pageCollector ended', output);
  });
  await browser.close();
}

batchPageCollector();
