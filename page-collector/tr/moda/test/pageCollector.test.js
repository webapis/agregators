const puppeteer = require('puppeteer');

describe('pageCollector test', function() {
  it('tr/koton/pageCollector test', async function() {
    this.timeout(100000);
    const browser = await puppeteer.launch({ headless: false, timeout: 0 });
    const { pageCollector } = require('../pageCollector');
    const { pageCounter } = require('../koton/pageCounter');
    await pageCollector({
      pagePath: '/kadin/giyim/alt-giyim/jean-pantolon/',
      marka: 'koton',
      url:
        'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044',
      pageCounter,
      // selector: '.productGrid',
      browser
    });
  });
  it.only('tr/defacto/pageCollector test', async function() {
    this.timeout(100000);
    const browser = await puppeteer.launch({ headless: false, timeout: 0 });

    const { pageCollector } = require('../pageCollector');
    const { pageCounter } = require('../defacto/pageCounter');
    await pageCollector({
      pagePath: '/kadin/giyim/alt-giyim/jean-pantolon/',
      marka: 'defacto',
      url: 'https://www.defacto.com.tr/kadin-jean-pantolon',
      pageCounter,
      // selector: '#products',
      browser
    });
  });
});
