const { pagePrerender } = require('../defacto/jeans/pagePrerender');

/* eslint-disable no-undef */
describe('page-prerender test', () => {
  it('test page prerender', async function() {
    this.timeout(50000);

    await pagePrerender({
      input: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-kategoriler.json`,
      pagePrerenderFunc: `${process.cwd()}/page-prerender/defacto/jeans/pagePrerender.js`,
      selector: 'product-list'
    });
  });
});
