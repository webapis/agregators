function extractDescription(items) {
 
  if (items.length === 0) return;
  const startPrice = items.sort(function(a, b) {
    var textA = a.price.salePrice.replace('TL', '');
    var textB = b.price.salePrice.replace('TL', '');

    return parseFloat(textA) < parseFloat(textB)
      ? -1
      : parseFloat(textA) > parseFloat(textB) ? 1 : 0;
  })[0].price.salePrice;
  const endPrice = items.sort(function(a, b) {
    var textA = a.price.salePrice.replace('TL', '');
    var textB = b.price.salePrice.replace('TL', '');

    return parseFloat(textA) > parseFloat(textB)
      ? -1
      : parseFloat(textA) < parseFloat(textB) ? 1 : 0;
  })[0].price.salePrice;
  const multiplePrice =
    parseFloat(startPrice.replace(/TL/i, '')) <
    parseFloat(endPrice.replace(/TL/i, ''));

  const pageDescriptions = [
    items.filter(i => i.buyukBeden === true).length > 0
      ? 'Büyük beden seçeneleri-' +
        items.filter(i => i.buyukBeden === true).length +
        ' adet'
      : null,
    items.filter(i => i.discount.discountRate !== null).length > 0
      ? 'Fiyat indirimli-' +
        items.filter(i => i.discount.discountRate !== null).length +
        ' adet'
      : null,
    multiplePrice === true
      ? startPrice + '-' + endPrice + ' fiyatlarda'
      : startPrice + ' fiyatdan',
    items.filter(i => i.onlineOzel === true).length > 0
      ? 'Online özel-' +
        items.filter(i => i.onlineOzel === true).length +
        ' adet'
      : null,
    items.filter(i => i.organik === true).length > 0
      ? 'Organik-' + items.filter(i => i.organik === true).length + ' adet'
      : null,
    items.filter(i => i.yeniSezon === true).length > 0
      ? 'Yeni sezon-' +
        items.filter(i => i.yeniSezon === true).length +
        ' adet.'
      : null
  ];

  const filteredDescription = pageDescriptions
    .filter(d => d !== null)
    .join('. ');
  return filteredDescription;
}

module.exports = {
  extractDescription
};
