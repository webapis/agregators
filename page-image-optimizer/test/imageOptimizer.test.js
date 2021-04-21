const { imageOptimizer } = require('../imageOptimizer');
describe('image optimizer test', function() {
  it('image ompimizer test', function() {
    this.timeout(50000);
    debugger;
    imageOptimizer({
      input: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.json`,
      output: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.json`,
      imgOutput: `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean/img`,
      imageUrl: '/tr/moda/defacto/kadin/jean/img'
    });
  });
});
