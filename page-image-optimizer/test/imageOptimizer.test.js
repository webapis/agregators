const { imageSizeOptimizer } = require('../imageSizeOptimizer');

describe('image optimizer test', function() {
  it.only('image ompimizer test', function() {
    this.timeout(50000);

    imageSizeOptimizer({
      input: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.json`,
      output: `${process.cwd()}/page-data/tr/moda/defacto/kadin/jean/kadin-denim.image-optimized-1.json`,
      imgOutput: `${process.cwd()}/page-build/tr/moda/defacto/kadin/jean/img`,
      imageUrl: '/tr/moda/defacto/kadin/jean/img'
    });
  });

  it('image ompimizer test', function() {
    this.timeout(50000);

    imageSizeOptimizer({
      input: `${process.cwd()}/page-data/tr/moda/koton/kadin/jean/jean-pantolon.json`,
      output: `${process.cwd()}/page-data/tr/moda/koton/kadin/jean/jean-pantolon.json`,
      imgOutput: `${process.cwd()}/page-build/tr/moda/koton/kadin/jean/pantolon/img`,
      imageUrl: '/tr/moda/koton/kadin/jean/pantolon/img'
    });
  });
});
