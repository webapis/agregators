describe('pageDataCollector test', () => {
  it('defacto dataCollector', async function() {
    this.timeout(50000);
    try {
      const { defactoHtml } = require('./itemHtml');
      debugger;
      const { itemDataCollector } = require('../tr/moda/defacto/itemDataCollector');
      const product = itemDataCollector({ html: defactoHtml });
      debugger;
    } catch (error) {
      debugger;
    }
  });

  it('koton itemDataCollector', async function() {
    try {
      this.timeout(50000);

      const { kotonItemHtml } = require('./itemHtml');
      debugger;
      const { itemDataCollector } = require('../tr/moda/koton/itemDataCollector');
      const product = itemDataCollector({ html: kotonItemHtml });
      debugger;
    } catch (error) {
      debugger;
    }
  });
});
