const { pages } = require('./pages');

async function dataCollectorServer() {
  await Promise.all(
    pages.map(async p => {
      const { input, dataCollectorFunc, output } = p;
      console.log('dataCollection started:', input);
      const { dataCollector } = require(dataCollectorFunc);

      await dataCollector({
        input,
        output
      });

      console.log('dataCollection ended:', output);
    })
  );
}
dataCollectorServer();
