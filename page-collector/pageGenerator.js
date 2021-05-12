const { walkSync } = require('./walkSync');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const ws_domain = 'tr/moda';

async function pageGeneration() {
  let files = [];
  console.log('page genegation started....');
  walkSync(`${process.cwd()}/page-leave/${ws_domain}`, async function(
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
      files.push(filepath.substring(filepath.indexOf('moda/')));
    }
  });
  const firstJson = files.filter(f => f.includes('-0.json'));

  let i = 0;
  for (i = 0; i < firstJson.length; i++) {
    const htmlOutput = `${process.cwd()}/page-list-pages/tr/${path.dirname(
      firstJson[i]
    )}`;
    const pageName = path.basename(firstJson[i], '.json').replace('-0', '');

    makeDir.sync(htmlOutput);
    const dom = new JSDOM(
      `<body>
            </body>`,
      { includeNodeLocations: true }
    );

    const content = dom.serialize();
    fs.writeFileSync(`${htmlOutput}/${pageName}.html`, content);
  }
  console.log('page genegation ended....');
  return true;
}

module.exports = { pageGeneration };
