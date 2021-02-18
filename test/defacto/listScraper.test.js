const puppeteer = require('puppeteer');
// const loadPageContent = require('../../utils/loadPageContent');
// const savePageContent = require('../../utils/savePageContent');
const { listScraper } = require('../../defacto/listScraper');
const { getPageCount } = require('../../defacto/getPageCount');
const { getProductUrls } = require('../../defacto/getProducturls');
const { urlInjector } = require('../../defacto/urlInjector');
describe('Test listScaper', function () {
  before(() => {
    process.env['APIFY_LOCAL_STORAGE_DIR'] = './apify_storage';
  });
  it.skip('savePage content', async function () {
    this.timeout(50000);
    await savePageContent({
      pageUrl: 'https://www.defacto.com.tr/kadin-esofman-alti?page=3',
      saveToUrl: 'test/defacto/pages/listPage.html',
    });
  });
  it.only('scrapes product data from listPage', async function () {
    this.timeout(50000);

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto('https://www.defacto.com.tr', {
      waitUntil: 'networkidle2',
    });

    // await listScraper({ page });
    //
    // await getPageCount({ page });
    //  await getProductUrls({ page });
    const queue = await urlInjector({ page });
  });
});
