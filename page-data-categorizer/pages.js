const pages = [
  {
    input: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.image-optimized-1.json`,
    output: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.categorized-2.json`,
    dataCategorizerFunc: `${process.cwd()}/page-data-categorizer/tr/moda/defacto/dataCategorizer.js`
  }
];

module.exports = {
  pages
};
