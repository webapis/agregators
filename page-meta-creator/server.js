var watch = require('node-watch');

const pages = [
  {
    input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
    output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-category.json`,
    output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/jean-category.json`,
    linkUrl: '/defacto/tr/kadin/jean/',
    metaCreatorFunc: `./defacto/tr/kadin/jean/nav/metaCreator.js`
  },
  {
    input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
    output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean`,
    output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean`,
    metaCreatorFunc: `./defacto/tr/kadin/jean/metaCreator.js`
  }
];

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
