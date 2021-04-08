const { pages } = require('../pages');

pages.filter(p => p.pageMeta !== null).map(async p => {
  const { pageMeta: { metaCreatorFunc } } = p;
  const { metaCreator } = require(metaCreatorFunc);

  await metaCreator({
    ...p.pageMeta
  });

  console.log('meta created.......');
  debugger;
});
