const { pageDataCategorizer } = require('./pageDataCategorizer');
const pages = [
  {
    input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
    output: `${process.cwd()}/page-data/defacto/tr/kadin-denim-categorized.json`,
    dataCategorizerFunc: `${process.cwd()}/paga-data-categorizer/defacto/dataCategorizer.js`
  }
];
pages.map(async p => {
  await pageDataCategorizer({
    ...p
  });

  console.log('data categorized.......');
});
