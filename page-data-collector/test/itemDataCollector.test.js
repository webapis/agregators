describe('pageDataCollector test', () => {
  it.only('defacto dataCollector', async function() {
    this.timeout(50000);
    try {
      const { defactoHtml } = require('./itemHtml');

      const {
        itemDataCollector
      } = require('../tr/moda/defacto/itemDataCollector');
      const product = itemDataCollector({ html: defactoHtml });
    } catch (error) {}
  });

  it('koton itemDataCollector', async function() {
    try {
      this.timeout(50000);

      const { kotonItemHtml } = require('./itemHtml');

      const {
        itemDataCollector
      } = require('../tr/moda/koton/itemDataCollector');
      const product = itemDataCollector({ html: kotonItemHtml });
    } catch (error) {}
  });
});
