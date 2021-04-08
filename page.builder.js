const { pages } = require('./pages');
var watch = require('node-watch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
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
  pages.filter(p => p.pageBuild !== null).map(async p => {
    const { pageBuild: { htmlOutput, component, json } } = p;
    const outputFolder = path.dirname(htmlOutput);
    await makeDir(outputFolder);
    const componentName = path.basename(component);
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
    debugger;

    const dom = new JSDOM(
      `<body>
            <script src="${relativeComponentPath}"></script>
            ${json ? `<script> window.jsonUrl ="${json}" </script>` : ''}
            </body>`,
      { includeNodeLocations: true }
    );

    debugger;
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
