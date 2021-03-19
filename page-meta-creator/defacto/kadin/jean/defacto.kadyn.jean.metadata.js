const { joinDataSetItems } = require('./joinDataSetItems');
const { splitIntoCategory } = require('./split-into-category');
async function defactoKadynJeanMetaData(items) {
  try {
    const joinedItems = await joinDataSetItems(items);
    const catSplit = await splitIntoCategory(joinedItems, 'kadin');
    return Promise.resolve(catSplit);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  defactoKadynJeanMetaData
};
