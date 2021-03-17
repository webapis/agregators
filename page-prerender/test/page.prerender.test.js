const puppeteer = require('puppeteer');
const { prerender } = require('../defacto/index');
const kadinjeanpantolonPage = require('../../aggregation/defacto/jean/kadin/kadin-jean-pantolonPage.json');
debugger;
/* eslint-disable no-undef */
describe('page-prerender test', () => {
  before(async () => {
    global.browser = await puppeteer.launch();
  });
  it('test page prerender', async function() {
    this.timeout(50000);
    const {
      pageTitle,
      pageName,
      pageDescription,
      items,
      wordPatterns
    } = kadinjeanpantolonPage;
    debugger;
    await prerender({
      browser,
      pageTitle,
      pageName,
      pageDescription,
      items: kadinjeanpantolonPage,
      wordPatterns,
      componentPath: 'src/ssr-components/product-list-page.js',
      output: `build/defacto`
    });
    debugger;
  });
});
