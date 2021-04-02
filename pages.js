const path = require('path');

const pages = [
  {
    pageData: null,
    pageMeta: null,
    pageBuild: pageBuildConfig({
      pageUrl: '/index.html',
      input: 'src/index.js',
      component: 'div'
    }),
    pagePrerender: { selector: '#root' }
  },
  {
    pageData: {
      input: 'https://www.defacto.com.tr/kadin-denim',
      output: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      dataCollectorFunc: './defacto/tr/dataCollector.js',
      pageUrlsGetterFunc: './defacto/tr/pageUrlsGetter.js'
    },
    pageMeta: {
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/pantolon.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/pantolon.json`,
      metaCreatorFunc: './defacto/tr/kadin/jean/metaCreator.js'
    },
    pageBuild: pageBuildConfig({
      pageUrl: '/defacto/tr/kadin/jean/pantolon.html',
      component: 'product-list',
      input: 'src/product-list-page.js'
    }),
    pagePrerender: { selector: 'product-list' }
  }
];

module.exports = {
  pages
};

function pageBuildConfig({ pageUrl, component, input, jsonData }) {
  const outputDir = `page-build${path.dirname(pageUrl)}`;
  const rollupOutputDir = outputDir;
  const htmlPluginName = path.basename(pageUrl);
  const htmlPluginComponent = component;
  const htmlPluginJsonFile = `./${path.basename(pageUrl, '.html')}.json`;
  const cssPluginDest = `${outputDir}/main.css`;
  const deletePluginTargets = `${outputDir}*.js`;
  debugger;
  return {
    rollup: {
      input,
      output: { dir: rollupOutputDir }
    },
    htmlPlugin: {
      name: htmlPluginName,
      component: htmlPluginComponent,
      jsonFile: htmlPluginJsonFile
    },
    cssPlugin: { dest: cssPluginDest },
    deletePlugin: { targets: deletePluginTargets }
  };
}
