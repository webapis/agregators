const { joinDataSetItems } = require('../../joinDataSetItems');
const { splitIntoCategory } = require('./split-into-category');
async function defactoKadynJean() {
  const joinedItems = await joinDataSetItems('defacto.defacto-kadin-jeans');
  const catSplit = await splitIntoCategory(joinedItems, 'kadin');

  return catSplit;
}

module.exports = {
  defactoKadynJean
};
