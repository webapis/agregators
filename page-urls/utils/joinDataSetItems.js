require('dotenv').config();
const Apify = require('apify');
async function joinDataSetItems(dataSetName) {
  try {
    const dataSet = await Apify.openDataset(dataSetName);

    const { items } = await dataSet.getData();
    const joinedDataSetItems = items.reduce((a, c, i) => {
      if (i === 0) {
        return [...c.products];
      }
      return [...a, ...c.products];
    }, []);
    return Promise.resolve(joinedDataSetItems);
    
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  joinDataSetItems
};
