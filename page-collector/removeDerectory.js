const fs = require('fs');
function removeDerectory(dir) {
  const folderpath = `${process.cwd()}/${dir}`;
  fs.rmdirSync(folderpath, { recursive: true });
  console.log(folderpath, '....removed');
  return true;
}

module.exports = {
  removeDerectory
};
