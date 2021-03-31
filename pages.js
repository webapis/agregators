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
      pageName: '/index.html',
      input: 'src/index.js',
      component: 'div',
      id: 'root',
      jsonUrl: ''
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
      pageName: '/defacto/kadin/jean/pantolon.html',
      input: 'src/product-list-page.js',
      component: 'product-list',
      id: 'defacto-kadin-jean-pantolon',
      jsonUrl: './defacto-kadin-jean-pantolon.json'
    },
    pagePrerender: { selector: 'product-list' }
  }
];

module.exports = {
  pages
};
