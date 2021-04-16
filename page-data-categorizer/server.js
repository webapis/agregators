const { pages } = require('./pages');
pages.map(async p => {
  const { dataCategorizerFunc } = p;
  debugger;
  const { dataCategorizer } = require(dataCategorizerFunc);
  dataCategorizer({ ...p });
  console.log('data categorized.......');
});
