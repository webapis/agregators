const pages = [
  {
    input: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.json`,
    output: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim-categorized.json`,
    dataCategorizerFunc: `${process.cwd()}/page-data-categorizer/tr/moda/defacto/dataCategorizer.js`
  }
];

module.exports = {
  pages
};
