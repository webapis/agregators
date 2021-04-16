const pages = [
  {
    input: `${process.cwd()}/page-collection/tr/moda/defacto/kadin-denim.html`,
    output: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim.json`,
    dataCollectorFunc: `${process.cwd()}/page-data-collector/tr/moda/defacto/dataCollector.js`
  },
  {
    input: `${process.cwd()}/page-collection/tr/moda/koton/jean-pantolon.html`,
    output: `${process.cwd()}/page-data/tr/moda/koton/jean-pantolon.json`,
    dataCollectorFunc: `${process.cwd()}/page-data-collector/tr/moda/koton/dataCollector.js`
  }
];

module.exports = {
  pages
};
