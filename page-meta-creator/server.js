const { pages } = require('../pages');

pages.filter(p => p.pageMeta !== null).map(async p => {
  const { pageMeta: { input, metaCreatorFunc, output, output2 } } = p;
  const { metaCreator } = require(metaCreatorFunc);

  await metaCreator({
    input,
    output,
    output2
  });

  console.log('meta created.......')
  debugger;
});
