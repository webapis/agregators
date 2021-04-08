const { metaCreator } = require('../defacto/tr/kadin/jean/metaCreator');

describe('Defacto Kadin Jean Meta creator', () => {
  it('test defactoKadynJeanMetaData ', async function() {
    this.timeout(50000);
    debugger;
    const data = await metaCreator({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/pantolon.json`
    });
    debugger;
  });

  it.only('nav/metaCreator', function() {
    const { metaCreator } = require('../defacto/tr/kadin/jean/nav/metaCreator');
    metaCreator({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-category.json`
    });
  });
});
