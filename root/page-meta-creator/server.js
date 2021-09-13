var watch = require('node-watch');
const { pages } = require('./pages');

async function metaCreator() {
  pages.map(async p => {
    const { metaCreatorFunc } = p;

    const { metaCreator } = require(metaCreatorFunc);

    await metaCreator({
      ...p
    });
    console.log('meta created.......');
  });
}
metaCreator();

if (process.env.NODE_ENV === 'dev') {
  watch('page-meta-creator', { recursive: true }, function(evt, name) {
    console.log('%s meta changed.', name);
    metaCreator();
  });
}
