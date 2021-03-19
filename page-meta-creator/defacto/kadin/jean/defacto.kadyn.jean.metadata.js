const { joinDataSetItems } = require('./joinDataSetItems');
const { splitIntoCategory } = require('./split-into-category');
async function defactoKadynJeanMetaData(items) {
  const joinedItems = await joinDataSetItems(items);
  const catSplit = await splitIntoCategory(joinedItems, 'kadin');
  return catSplit;
}

module.exports = {
  defactoKadynJeanMetaData
};
