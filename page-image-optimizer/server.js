const defactoPages = require('./defacto/pages');
const { imageOptimizer } = require('./imageOptimizer');

const pages = [...defactoPages];

async function batchImageOptimizer() {
  await Promise.all(
    pages.map(async p => {
      const { input, output, imgOutput, imageUrl } = p;
      debugger;
      await imageOptimizer({ input, output, imgOutput, imageUrl });
    })
  );
}
batchImageOptimizer();
