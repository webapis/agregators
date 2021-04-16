const { pages } = require('./pages');
pages.map(async p => {
  const { dataCategorizerFunc } = p;

  const { dataCategorizer } = require(dataCategorizerFunc);
  dataCategorizer({ ...p });
  console.log('data categorized.......');
});
