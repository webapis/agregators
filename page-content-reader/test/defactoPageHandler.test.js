const { pageContentReader } = require('../index');
const { defactoPageHandler } = require('../defacto/defactoPageHandler');
describe('defactoPageHandler', () => {
  it('read page data', async function() {
    this.timeout(50000);
    try {
      const result = await pageContentReader({
        url: 'https://www.defacto.com.tr/kadin-denim',
        pageHandler: defactoPageHandler
      });
      debugger;
    } catch (error) {
      debugger;
    }
  });
});
