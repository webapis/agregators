const fs = require('fs');
const makeDir = require('make-dir');
const core = require('@actions/core');
const {
  prerender
} = require(`${process.cwd()}/page-prerender/defacto/index.js`);

async function prerenderAction() {
  const kadinjeanpantolonPage = require(`${process.cwd()}/page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json`);
  try {
    const outputDir = `${process.cwd()}/build/defacto`;
    await makeDir(outputDir);
    const filePath = `${outputDir}/defacto-kadin-jean-pantolon.html`;
    const content = await prerender({
      items: kadinjeanpantolonPage,
      componentPath: 'src/ssr-components/product-list-page.js'
    });
    fs.writeFileSync(filePath, content);

    console.log('prerendered');
  } catch (error) {
    core.setFailed(error.message);
  }
}
prerenderAction();
