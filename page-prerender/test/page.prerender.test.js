const fs = require('fs');
const makeDir = require('make-dir');
const { prerender } = require('../defacto/index');
const kadinjeanpantolonPage = require('../../page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json');
debugger;
/* eslint-disable no-undef */
describe('page-prerender test', () => {
  it('test page prerender', async function() {
    this.timeout(50000);
    const outputDir = `${process.cwd()}/build/defacto`;
    await makeDir(outputDir);
    const filePath = `${outputDir}/defacto-kadin-jean-pantolon.html`;
    debugger;
    const content = await prerender({
      items: kadinjeanpantolonPage,
      componentPath: 'src/ssr-components/product-list-page.js'
    });
    fs.writeFileSync(filePath, content);
    debugger;
  });
});
