async function productSearchWords(datasets) {
  const searchWords = datasets.map(d => {
    const mapProductNames = d.map(f => f.productName);
    const joinProductNames = mapProductNames.join(' ');
    const splitProductWords = joinProductNames.split(' ');
    const removeDublicateWords = splitProductWords
      .filter(function(item, i, allItems) {
        return i == allItems.indexOf(item);
      })
      .join(' ');
    debugger;
    return removeDublicateWords;
  });
  debugger;

  return searchWords;
}

module.exports = {
  productSearchWords
};
