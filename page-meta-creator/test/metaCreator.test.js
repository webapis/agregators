const { metaCreator } = require('../defacto/tr/kadin/jean/metaCreator');

describe('Defacto Kadin Jean Meta creator', () => {
  it.only('test defactoKadynJeanMetaData ', async function() {
    this.timeout(50000);

    const data = await metaCreator({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim-categorized.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean`,
      metaCreatorFunc: `./defacto/tr/kadin/jean/metaCreator.js`
    });
  });

  it('nav/metaCreator', function() {
    const { metaCreator } = require('../defacto/tr/kadin/jean/nav/metaCreator');
    metaCreator({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim-categorized.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-kategoriler.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/jean-kategoriler.json`,
      linkUrl: '/defacto/tr/kadin/jean/'
    });
  });
});
