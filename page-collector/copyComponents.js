const fs = require('fs');
const { walkSync } = require('./walkSync');
const makeDir = require('make-dir');
const path = require('path');
function copyComponents() {
  walkSync(`${process.cwd()}/src/csr-components`, async function(filepath) {
    console.log(`copy components started....`);
    if (!filepath.includes('.DS_Store')) {
      const newDestination = filepath.replace(
        'src/csr-components',
        'page-build/components'
      );
      debugger;
      makeDir.sync(path.dirname(newDestination));
      debugger;
      fs.copyFileSync(filepath, newDestination);
    }
    console.log(`copy components ended....`);
  });
}

module.exports = { copyComponents };
