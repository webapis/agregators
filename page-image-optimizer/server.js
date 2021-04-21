const defactoPages = require('./defacto/pages');
const kotonPages = require('./koton/pages');
const { imageOptimizer } = require('./imageOptimizer');

const pages = [...defactoPages, ...kotonPages];

async function batchImageOptimizer() {
  await Promise.all(
    pages.map(async p => {
      const { input, output, imgOutput, imageUrl } = p;

      await imageOptimizer({ input, output, imgOutput, imageUrl });
    })
  );
}
batchImageOptimizer();
