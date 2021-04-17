module.exports = [
  {
    //jean-pantolon
    input:
      'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044',
    output: `${process.cwd()}/page-collection/tr/moda/koton/kadin/jean/jean-pantolon.html`,
    pageUrl:
      'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044?q=%3Arelevance&psize=192&page=',
    pageCollectorFunc: `${process.cwd()}/page-collector/tr/moda/koton/pageCollector.js`
  },
  {
    //jean-ceket
    input:
      'https://www.koton.com/tr/kadin/giyim/dis-giyim/jean-ceket/c/M01-C02-N01-AK104-K100040',
    output: `${process.cwd()}/page-collection/tr/moda/koton/kadin/jean/jean-ceket.html`,
    pageCollectorFunc: `${process.cwd()}/page-collector/tr/moda/koton/pageCollector.js`
  },
  {
    //jean-etek
    input:
      'https://www.koton.com/tr/kadin/giyim/alt-giyim/c/M01-C02-N01-AK102?text=&q=%3Arelevance%3Acategories%3AK100053#',
    output: `${process.cwd()}/page-collection/tr/moda/koton/kadin/jean/jean-etek.html`,
    pageCollectorFunc: `${process.cwd()}/page-collector/tr/moda/koton/pageCollector.js`
  },
  {
    //jean-sort
    input:
      'https://www.koton.com/tr/kadin/giyim/alt-giyim/c/M01-C02-N01-AK102?text=&q=%3Arelevance%3Acategories%3AK100111#',
    output: `${process.cwd()}/page-collection/tr/moda/koton/kadin/jean/jean-sort.html`,
    pageUrl:
      'https://www.koton.com/tr/kadin/giyim/alt-giyim/c/M01-C02-N01-AK102?q=%3Arelevance%3Acategories%3AK100111&psize=192&page=',
    pageCollectorFunc: `${process.cwd()}/page-collector/tr/moda/koton/pageCollector.js`
  }
];
