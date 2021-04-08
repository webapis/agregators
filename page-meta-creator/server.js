const { pages } = require('../pages');
var watch = require('node-watch');
async function metaCreator() {
  pages.filter(p => p.pageMeta !== null).map(async p => {
    const { pageMeta: { metaCreatorFunc } } = p;
    const { metaCreator } = require(metaCreatorFunc);

    await metaCreator({
      ...p.pageMeta
    });

    console.log('meta created.......');
    debugger;
  });
}
metaCreator();

if (process.env.NODE_ENV === 'dev') {
  watch('page-meta-creator', { recursive: true }, function(evt, name) {
    console.log('%s meta changed.', name);
    metaCreator();
  });
}
