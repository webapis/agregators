const { prerender } = require('../defacto/index');

/* eslint-disable no-undef */
describe('page-prerender test', () => {
  it('test page prerender', async function() {
    this.timeout(50000);

    await prerender();
  });
});
