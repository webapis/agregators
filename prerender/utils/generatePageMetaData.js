async function generatePageMetaData(datasets) {
  try {
    debugger;
    const pagesWithMetaDatas = datasets.map(dataset => {
      return dataset.reduce((acc, curr, i) => {
        const {
          buyukBeden,
          onlineOzel,
          yeniSezon,
          organik,
          price: { salePrice },
          productName
        } = curr[0];
        const pageTitle =
          curr[0].productName
            .toLowerCase()
            .split(' ')
            .map(word => {
              return word[0].toUpperCase() + word.substring(1);
            })
            .join(' ') + '| Defacto | Giyim Marka';

        const pageDescription = `Fiyat ${salePrice}${'.'} ${yeniSezon !== null
          ? 'Yeni sezon. '
          : ''}${organik !== null ? 'Organik.' : ''}${onlineOzel !== null
          ? 'Online Özel. '
          : ''}${buyukBeden !== null
          ? ' Büyük beden seçenekli. '
          : ''}${productName
          .toLowerCase()
          .split(' ')
          .map((word, i) => {
            if (i === 0) {
              return word[0].toUpperCase() + word.substring(1);
            }
            return word;
          })
          .join(' ')}.`;
        if (i === 0) {
          return [
            {
              pageTitle,
              pageDescription,
              items: curr
            }
          ];
        }

        return [
          ...acc,
          {
            pageTitle,

            pageDescription,
            items: curr
          }
        ];
      }, []);
    });

    return Promise.resolve(pagesWithMetaDatas);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  generatePageMetaData
};
