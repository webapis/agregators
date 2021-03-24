const fs = require('fs');
const makeDir = require('make-dir');
const { prerender } = require('../defacto/index');
const kadinjeanpantolonPage = require(`${process.cwd()}/build/page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json`);
debugger;
/* eslint-disable no-undef */
describe('page-prerender test', () => {
  it('test page prerender', async function() {
    this.timeout(50000);
    const outputDir = `${process.cwd()}/build`;
    await makeDir(outputDir);
    const filePath = `${outputDir}/index.html`;
    debugger;
    const content = await prerender({
      items: kadinjeanpantolonPage,
      componentPath: 'src/ssr-components/product-list-page.js'
    });
    fs.writeFileSync(filePath, content);
    debugger;
  });
});
