/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const {
  defactoPageHandler
} = require('../../scrape/defacto/defactoPageHandler');
const {
  defactoNextPageUrls
} = require('../../scrape/defacto/defactoNextPageUrls');
const loadPageContent = require('../../utils/loadPageContent');
const savePageContent = require('../../utils/savePageContent');
const kayndenim = require('../defacto/pages/kadin-denim');
const assert = require('assert');
describe('Test Kadin-denim page scraped data', function() {
  before(() => {
    process.env['APIFY_LOCAL_STORAGE_DIR'] = './apify_storage';
  });
  it.skip('savePage content', async function() {
    this.timeout(50000);
    await savePageContent({
      pageUrl: 'https://www.defacto.com.tr/kadin-denim',
      saveToUrl: 'test/defacto/pages/kadin-denim.html'
    });
  });
  it('scrapes product data from listPage', async function() {
    this.timeout(50000);
    debugger;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('request', async interceptedRequest => {
      if (interceptedRequest.resourceType() === 'image') {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });
    const content = await loadPageContent({
      filepath: 'test/defacto/pages/kadin-denim.html'
    });
    await page.setContent(content, { waitUntil: 'networkidle2' });
    const pageData = await defactoPageHandler({ page });
    debugger;
    assert.deepEqual(kayndenim, pageData);
  });

  it.skip('defactoNextPageUrls', async () => {
    this.timeout(50000);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('request', async interceptedRequest => {
      if (interceptedRequest.resourceType() === 'image') {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });
    const content = await loadPageContent({
      filepath: 'test/defacto/pages/kadin-denim.html'
    });
    await page.setContent(content, { waitUntil: 'networkidle2' });
    debugger;
    const nextPageUrls = await defactoNextPageUrls({ page });
    debugger;
  });
});
