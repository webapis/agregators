

describe('Defacto Kadin Jean Meta creator', () => {
  it.only('tr/moda/defacto/kadin/jean/metaCreator', async function() {
    this.timeout(50000);
    const { metaCreator } = require('../tr/moda/defacto/kadin/jean/metaCreator');
    const data = await metaCreator({
      input: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim-categorized.json`,
      output: `${process.cwd()}/page-meta/tr/moda/defacto/kadin/jean`,
      output2: `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean`,
      metaCreatorFunc: `./tr/moda/defacto/kadin/jean/metaCreator.js`
    });
  });

  it('tr/moda/defacto/kadin/jean/nav/metaCreator', function() {
    const {
      metaCreator
    } = require('../tr/moda/defacto/kadin/jean/nav/metaCreator');
    metaCreator({
      input: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim-categorized.json`,
      output: `${process.cwd()}/page-meta/tr/moda/defacto/kadin/jean/jean-kategoriler.json`,
      output2: `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean/jean-kategoriler.json`,
      linkUrl: '/tr/moda/defacto/kadin/jean/'
    });
  });
});
