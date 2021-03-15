require('dotenv').config();
const Apify = require('apify');
const { firstPageUrls } = require('../../scrape/defacto/defactoFirstPageUrls');

async function joinDataSets() {
  try {
    return await Promise.all(
      firstPageUrls.map(async f => {
        const { folderName } = f;
        const dataSet = await Apify.openDataset(
          `${process.env.MARKA}.${folderName}`
        );
       
        const { items } = await dataSet.getData();
       
        return items.reduce((a, c, i) => {
          if (i === 0) {
            return [...c.products];
          }
          return [...a, ...c.products];
        }, []);
      })
    );
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  joinDataSets
};
