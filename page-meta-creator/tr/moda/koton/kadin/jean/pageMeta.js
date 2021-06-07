const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
function pageMeta({ dataObject, pageTitle, output, output2 }) {
  const withPageTitle = { items: dataObject, pageTitle: pageTitle };
  makeDir.sync(path.dirname(output));
  makeDir.sync(path.dirname(output2));
  fs.writeFileSync(output, JSON.stringify(withPageTitle));
  fs.writeFileSync(output2, JSON.stringify(withPageTitle));
}

module.exports = { pageMeta };
