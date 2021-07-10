const { pagePrerender } = require('../defacto/jeans/pagePrerender');

/* eslint-disable no-undef */
describe('page-prerender test', () => {
  it('test page prerender', async function() {
    this.timeout(50000);

    await pagePrerender({
      input: `${process.cwd()}/page-meta/tr/moda/defacto/kadin/jean/jean-kategoriler.json`,
      pagePrerenderFunc: `${process.cwd()}/page-prerender/tr/moda/defacto/jeans/pagePrerender.js`,
      selector: 'product-list'
    });
  });
});
