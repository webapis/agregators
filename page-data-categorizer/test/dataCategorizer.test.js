const {
  dataCategorizer
} = require(`${process.cwd()}/page-data-categorizer/defacto/dataCategorizer.js`);

describe('Defacto jean Data Categorizer', () => {
  it.only('test Data Categorizer', async function() {
    this.timeout(50000);

    const data = await dataCategorizer({
      input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
      output: `${process.cwd()}/page-data/defacto/tr/kadin-denim-categorized.json`,
      dataCategorizerFunc: `${process.cwd()}/paga-data-categorizer/defacto/dataCategorizer.js`
    });
  });
});
