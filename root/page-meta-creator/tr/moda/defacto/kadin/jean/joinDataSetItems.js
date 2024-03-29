async function joinDataSetItems(items) {
  try {
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
