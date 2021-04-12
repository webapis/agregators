const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
function dataCategorizer({ input, output }) {
  makeDir.sync(path.dirname(output));
  debugger;
  const data = fs.readFileSync(input, 'utf-8');
  const dataObject = JSON.parse(data);
  debugger;
  const categorizedData = dataObject.map(d => {
    const { productName } = d;
    let category = productName
      .substring(productName.lastIndexOf(' '))
      .replace(/\s/g, '');
    switch (productName) {
      case 'DÜĞMELİ JEAN SALOPET':
        debugger;
        category = 'ELBİSE';
        break;
      case 'NORMAL BEL TROUSERS':
      case 'VİNTAGE SLİM FİT YÜKSEK BEL JEAN PANTOLN':
      case 'CARROT FİT JEAN BERMUDA':
        debugger;
        category = 'PANTOLON';
        break;
    }
    return { ...d, category };
  });
  fs.writeFileSync(output, JSON.stringify(categorizedData));
  debugger;
}

module.exports = {
  dataCategorizer
};
