

const pages = [
  {
    pageData: null,
    pageMeta: null,
    pageBuild: {
      htmlOutput: 'page-build/index.html',
      component: 'src/csr-components/home-page.js'
    },
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
    pageBuild: {
      htmlOutput: 'page-build/defacto/tr/kadin/jean/pantolon.html',
      component: 'src/csr-components/product-list/product-list.js',
      json: './pantolon.json'
    },
    pagePrerender: { selector: 'product-list' }
  },
  {
    pageData: null,
    pageMeta: {
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/ceket.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/ceket.json`,
      metaCreatorFunc: './defacto/tr/kadin/jean/metaCreator.js'
    },
    pageBuild: {
      htmlOutput: 'page-build/defacto/tr/kadin/jean/ceket.html',
      component: 'src/csr-components/product-list/product-list.js',
      json: './ceket.json'
    },
    pagePrerender: { selector: 'product-list' }
  },
  {
    pageData: null,
    pageMeta: {
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/elbise.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/elbise.json`,
      metaCreatorFunc: './defacto/tr/kadin/jean/metaCreator.js'
    },
    pageBuild: {
      pageUrl: '/defacto/tr/kadin/jean/elbise.html',
      htmlOutput: 'page-build/defacto/tr/kadin/jean/elbise.html',
      component: 'src/csr-components/product-list/product-list.js',
      json: './elbise.json'
    },
    pagePrerender: { selector: 'product-list' }
  },
  {
    pageData: null,
    pageMeta: {
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-category.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/jean-category.json`,
      linkUrl: '/defacto/tr/kadin/jean/',
      metaCreatorFunc: './defacto/tr/kadin/jean/nav/metaCreator.js'
    },
    pageBuild: {
      htmlOutput: 'page-build/defacto/tr/kadin/jean/jean-category.html',
      component: 'src/csr-components/products-nav.js',
      json: './jean-category.json'
    },
    pagePrerender: { selector: '#root' }
  }
];

module.exports = {
  pages
};
