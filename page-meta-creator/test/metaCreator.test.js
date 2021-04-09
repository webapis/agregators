const { metaCreator } = require('../defacto/tr/kadin/jean/metaCreator');

describe('Defacto Kadin Jean Meta creator', () => {
  it('test defactoKadynJeanMetaData ', async function() {
    this.timeout(50000);

    const data = await metaCreator({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/tulum.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/tulum.json`
    });
  });

  it.only('nav/metaCreator', function() {
    const { metaCreator } = require('../defacto/tr/kadin/jean/nav/metaCreator');
    metaCreator({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-category.json`,
      output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/jean-category.json`,
      linkUrl: '/defacto/tr/kadin/jean/'
    });
  });
});
