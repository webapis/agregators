var watch = require('node-watch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const { defactoPageBuilder } = require('./defacto');
const { homePage } = require('./home');
const fsExtra = require('fs-extra');
const path = require('path');
const makeDir = require('make-dir');

async function prebuild() {
  const outputFolder = await makeDir('page-build/components/');
  const sourceFoler = `${process.cwd()}/src/csr-components/`;

  fsExtra.copySync(sourceFoler, outputFolder);

  return Promise.resolve(true);
}
async function build() {
  const pages = defactoPageBuilder();
  const allPages = [...pages, homePage];
  allPages.map(async p => {
    const { htmlOutput, component, json } = p;

    const outputFolder = path.dirname(htmlOutput);
    await makeDir(outputFolder);
    const componentName = path.basename(component);
    const tagName = path.basename(component, '.js');
    const componentDotPath = path
      .dirname(htmlOutput)
      .replace(/\//g, ' ')
      .split(' ')
      .slice(1)
      .map(() => '../')
      .join(' ')
      .replace(/\s/g, '');
    const forwardComponentDothPath = path
      .dirname(component)
      .replace(/\//g, ' ')
      .split(' ')
      .slice(2)
      .map(f => `/${f}/`)
      .join(' ');
    const relativeComponentPath = (componentDotPath +
      'components/' +
      forwardComponentDothPath +
      componentName).replace(/\/\//g, '/');

    const dom = new JSDOM(
      `<body>
          <${tagName}></${tagName}>
            <script src="${relativeComponentPath}"></script>
            ${json ? `<script> window.jsonUrl ="${json}" </script>` : ''}
            </body>`,
      { includeNodeLocations: true }
    );

    const content = dom.serialize();
    fs.writeFileSync(htmlOutput, content);

    console.log('pageBuilder complete....');
  });
}
prebuild().then(async () => {
  await build();
});

if (process.env.NODE_ENV === 'dev') {
  watch('src', { recursive: true }, function(evt, name) {
    console.log('%s changed.', name);
    prebuild().then(async () => {
      await build();
    });
  });
}
