describe('pageCollector test', function() {
  it.only('tr/koton/pageCollector test', async function() {
    this.timeout(100000);
    debugger;
    const pages = require('../tr/moda/koton/pages');
    await Promise.all(
      pages.map(async p => {
        const { input, pageCollectorFunc, output } = p;

        console.log('pageCollector started', input);
        const { pageCollector } = require(pageCollectorFunc);
        await pageCollector({
          ...p
        });
        console.log('pageCollector ended', output);
      })
    );
  });
  it('tr/defacto/pageCollector test', async function() {
    this.timeout(100000);

    const pages = require('../tr/moda/defacto/pages');

    await Promise.all(
      pages.map(async p => {
        const { input, pageCollectorFunc, output } = p;

        console.log('pageCollector started', input);
        const { pageCollector } = require(pageCollectorFunc);
        await pageCollector({
          input,
          output
        });
        console.log('pageCollector ended', output);
      })
    );
  });
});
