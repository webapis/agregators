async function splitDatasetsByProductName(datasets) {
  try {
    const splittedDatasets = datasets.map(d => {
      var currentArray = [];
      return d.reduce((acc, curr, i) => {
        if (i === 0) {
          currentArray = [curr];
        } else {
          const currentProductName = currentArray[0].productName;

          if (currentProductName === curr.productName) {
            currentArray.push(curr);
          } else {
            acc.push(currentArray);
            currentArray = [];
            currentArray = [curr];
            return acc;
          }
        }

        return acc;
      }, []);
    });
    return Promise.resolve(splittedDatasets);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  splitDatasetsByProductName
};
