describe('Defacto jean Data Categorizer', () => {
  it.only('test Data Categorizer', async function() {
    this.timeout(50000);
    debugger;
    const {
      dataCategorizer
    } = require(`${process.cwd()}/page-data-categorizer/tr/moda/defacto/dataCategorizer.js`);
    const data = await dataCategorizer({
      input: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim.json`,
      output: `${process.cwd()}/page-data/tr/moda/defacto/kadin-denim-categorized.json`
    });
  });
});
