const defactoPages = require('./defacto/pages');
const kotonPages = require('./koton/pages');
const { imageSizeOptimizer } = require('./imageSizeOptimizer');

const pages = [...defactoPages];

async function batchImageSizeOptimizer() {
  await Promise.all(
    pages.map(async p => {
      const { input, output, imgOutput, imageUrl } = p;

      await imageSizeOptimizer({ input, output, imgOutput, imageUrl });
    })
  );
}
batchImageSizeOptimizer();
