const pages = [
  {
    input: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim-categorized.json`,
    output: `${process.cwd()}/page-meta/tr/moda/defacto/kadin/jean/jean-kategoriler.json`,
    output2: `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean/jean-kategoriler.json`,
    linkUrl: '/tr/moda/defacto/kadin/jean/',
    metaCreatorFunc: `./tr/moda/defacto/kadin/jean/nav/metaCreator.js`
  },
  {
    input: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim-categorized.json`,
    output: `${process.cwd()}/page-meta/tr/moda/defacto/kadin/jean`,
    output2: `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean`,
    metaCreatorFunc: `./tr/moda/defacto/kadin/jean/metaCreator.js`
  }
];
module.exports = { pages };
