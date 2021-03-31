const {
  defactoDataCollector
} = require('./page-data-collector/defacto/defactoDataCollector');
const {
  defactoNextPageUrls
} = require('./page-data-collector/defacto/defactoNextPageUrls');

const pages = [
  {
    pageData: null,
    pageMeta: null,
    pageBuild: {
      rollup: {
        input: 'src/index.js',
        output: { dir: 'page-build' }
      },
      htmlPlugin: {
        name: 'index.html',
        component: 'div',
        jsonFile: ''
      },
      cssPlugin: { dest: 'page-build/main.css' },
      deletePlugin: { targets: 'page-build/*.js' }
    },
    pagePrerender: { selector: '#root' }
  },
  {
    pageData: {
      sourceUrl: 'https://www.defacto.com.tr/kadin-denim',
      dataCollector: defactoDataCollector,
      pageUrlsGetter: defactoNextPageUrls,
      output: `${process.cwd()}/page-data/defacto/kadin/kadin-jeans.json`
    },
    pageMeta: {},
    pageBuild: {
      rollup: {
        input: 'src/product-list-page.js',
        output: { dir: 'page-build/defacto/kadin/jean' }
      },
      htmlPlugin: {
        name: 'pantolon.html',
        component: 'product-list',
        jsonFile: './defacto-kadin-jean-pantolon.json'
      },
      cssPlugin: { dest: 'page-build/page-build/defacto/kadin/jean/main.css' },
      deletePlugin: { targets: 'page-build/page-build/defacto/kadin/jean/*.js' }
    },
    pagePrerender: { selector: 'product-list' }
  }
];

module.exports = {
  pages
};

function pageBuildConfig({ pageUrl, component }) {
  const rollupInput = '';
  const rollupOutputDir = '';

  const htmlPluginName = '';
  const htmlPluginComponent = '';
  const htmlPluginJsonFile = '';

  const cssPluginDest = '';
  const deletePluginTargets = '';
  return null;
}
