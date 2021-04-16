const pages = [
  {
    input:
      'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044',
    output: `${process.cwd()}/page-collection/tr/moda/koton/jean-pantolon.html`,
    pageCollectorFunc: `${process.cwd()}/page-collector/tr/moda/koton/pageCollector.js`
  },{
    input: 'https://www.defacto.com.tr/kadin-denim',
    output: `${process.cwd()}/page-collection/tr/moda/defacto/kadin-denim.html`,
    pageCollectorFunc: `${process.cwd()}/page-collector/tr/moda/defacto/pageCollector.js`
  }
];

module.exports = { pages };
