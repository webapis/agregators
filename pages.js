const {
  defactoDataCollector
} = require('./page-data-collector/defacto/defactoDataCollector');
const {
  defactoNextPageUrls
} = require('./page-data-collector/defacto/defactoNextPageUrls');
// const {
//   defactoKadynJeanMetaData
// } = require('./page-meta-creator/defacto/kadin/jean/defacto.kadyn.jean.metadata');

const pages = [
  {
    pageName: '/index.html',
    input: 'src/index.js',
    selector: '#root',
    component: 'div',
    id: 'root',
    jsonUrl: '',
    pageDataCollector: null,
    pageMetaCreator: null
  },
  {
    pageName: '/defacto/kadin/jean/pantolon.html',
    input: 'src/product-list-page.js',
    selector: 'product-list',
    component: 'product-list',
    id: 'defacto-kadin-jean-pantolon',
    jsonUrl: './defacto-kadin-jean-pantolon.json',
    dataCollection: {
      sourceUrl: 'https://www.defacto.com.tr/kadin-denim',
      dataCollector: defactoDataCollector,
      pageUrlsGetter: defactoNextPageUrls,
      output: `${process.cwd()}/page-data/defacto/kadin/kadin-jeans.json`
    },
    metaCreation: {
     // metaCreator: defactoKadynJeanMetaData
    }
  }
];

module.exports = {
  pages
};
