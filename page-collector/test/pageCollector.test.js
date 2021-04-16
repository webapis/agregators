

describe('pageCollector test', function() {
  it.only('tr/koton/pageCollector test', async function() {
    debugger;
    this.timeout(100000);
    const { pageCollector } = require('../tr/moda/koton/pageCollector');
    await pageCollector({
      input:
        'https://www.koton.com/tr/kadin/giyim/alt-giyim/jean-pantolon/c/M01-C02-N01-AK102-K100044',
      output: `${process.cwd()}/page-collection/tr/moda/koton/jean-pantolon.html`
    });
  });
  it('tr/defacto/pageCollector test', async function() {
    debugger;
    this.timeout(100000);
    debugger;
    const { pageCollector } = require('../tr/moda/defacto/pageCollector');
    debugger;
    await pageCollector({
      input: 'https://www.defacto.com.tr/kadin-denim',
      output: `${process.cwd()}/page-collection/tr/moda/defacto/kadin-denim.html`
    });
  });
});
