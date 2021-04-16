const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
function dataCategorizer({ input, output }) {
  makeDir.sync(path.dirname(output));

  const data = fs.readFileSync(input, 'utf-8');
  const dataObject = JSON.parse(data);

  const categorizedData = dataObject.map(d => {
    const { productName } = d;
    let category = productName
      .substring(productName.lastIndexOf(' '))
      .replace(/\s/g, '');

    switch (productName) {
      case 'DÜĞMELİ JEAN SALOPET':
        category = 'ELBİSE';
        break;
      case 'NORMAL BEL TROUSERS':
      case 'VİNTAGE SLİM FİT YÜKSEK BEL JEAN PANTOLN':
      case 'CARROT FİT JEAN BERMUDA':
        category = 'PANTOLON';
        break;
    }
    return { ...d, category };
  });
  fs.writeFileSync(output, JSON.stringify(categorizedData));
}

module.exports = {
  dataCategorizer
};
