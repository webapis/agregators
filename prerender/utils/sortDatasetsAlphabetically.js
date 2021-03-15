function sortDataSetsAlphabetically(datasets) {
  try {
    const sortedDataSets = datasets.map(d => {
      return d
        .sort(function(a, b) {
          var textA = a.productName.toUpperCase();
          var textB = b.productName.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        })
        .sort(function(a, b) {
          var textA = a.price.salePrice.toUpperCase();
          var textB = b.price.salePrice.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
    });

    return Promise.resolve(sortedDataSets);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  sortDataSetsAlphabetically
};
