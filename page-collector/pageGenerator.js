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
  walkSync(`${process.cwd()}/page-leave`, async function(filepath) {
    //if (!filepath.includes('.DS_Store')) {
    //files.push(filepath.substring(filepath.indexOf('page-leave/')));
    files.push(filepath);
    //}
  });
  const firstJson = files.filter(f => f.includes('-0.json'));

  let i = 0;
  for (i = 0; i < firstJson.length; i++) {
    let htmlOutput = '';
    const pageName = path.basename(firstJson[i], '.json').replace(/-0.*/i, '');
    const lastFolder = firstJson[i]
      .substring(firstJson[i].lastIndexOf('/') + 1)
      .replace('-0.json', '');
    if (lastFolder === pageName) {
      htmlOutput = `${path.dirname(firstJson[i])}`
        .replace(`/${lastFolder}`, '')
        .replace('page-leave', 'page-list-pages');
    } else {
      htmlOutput = `${path.dirname(firstJson[i])}`.replace(
        'page-leave',
        'page-list-pages'
      );
    }
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