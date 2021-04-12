const pages = [
  {
    input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
    output: `${process.cwd()}/page-data/defacto/tr/kadin-denim-categorized.json`,
    dataCategorizerFunc: `${process.cwd()}/page-data-categorizer/defacto/dataCategorizer.js`
  }
];
pages.map(async p => {
  const { dataCategorizerFunc } = p;
  debugger;
  const { dataCategorizer } = require(dataCategorizerFunc);
  dataCategorizer({ ...p });

  console.log('data categorized.......');
});
