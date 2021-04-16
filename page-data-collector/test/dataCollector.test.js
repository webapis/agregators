describe('pageDataCollector test', () => {
  it.only('defacto dataCollector', async function() {
    this.timeout(50000);
    try {
      const { dataCollector } = require('../tr/moda/defacto/dataCollector');
      await dataCollector({
        input: `${process.cwd()}/page-collection/tr/moda/defacto/kadin-denim.html`,
        output: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim.json`
      });
    } catch (error) {
      debugger;
    }
  });

  it('koton dataCollector', async function() {
    try {
      this.timeout(50000);
      debugger;
      const { dataCollector } = require('../tr/moda/koton/dataCollector');
      await dataCollector({
        input: `${process.cwd()}/page-collection/tr/moda/koton/jean-pantolon.html`,
        output: `${process.cwd()}/page-data/tr/moda/koton/jean-pantolon.json`
      });
    } catch (error) {
      debugger;
    }
  });
});
