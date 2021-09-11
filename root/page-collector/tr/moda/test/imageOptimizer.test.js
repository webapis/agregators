const { imageSizeOptimizer } = require('../imageSizeOptimizer');
const fs = require('fs');

describe('image optimizer test', function() {
  it('image ompimizer test', async function() {
    this.timeout(50000);

    const data = await imageSizeOptimizer({
      input: `${process.cwd()}/page-data/tr/moda/kadin/giyim/alt-giyim/jean-sort/defacto.json`,
      // output: `${process.cwd()}/page-data/tr/moda/kadin/giyim/alt-giyim/jean-sort/defacto.image-optimized-1.json`,
      imgOutput: `${process.cwd()}/page-build/tr/moda/kadin/giyim/alt-giyim/jean-sort/img`
      // imageUrl: '/tr/moda/kadin/giyim/alt-giyim/jean-sort/img'
    });
  });

  it('image ompimizer test', async function() {
    this.timeout(50000);

    const data = await imageSizeOptimizer({
      input: `${process.cwd()}/page-data/tr/moda/kadin/giyim/alt-giyim/jean-etek/koton.json`,
      // output: `${process.cwd()}/page-data/tr/moda/kadin/giyim/alt-giyim/jean-etek/koton.image-optimized-1.json`,
      imgOutput: `${process.cwd()}/page-build/tr/moda/kadin/giyim/alt-giyim/jean-etek/img`
      // imageUrl: '/tr/moda/koton/kadin/jean/pantolon/img'
    });
  });
});
