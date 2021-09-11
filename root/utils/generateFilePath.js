const path = require('path');
function generateFilePath({ filePath }) {
  const relativePath = path
    .dirname(filePath)
    .split('/')
    .map(() => '..')
    .join('/');

  return relativePath;
}

module.exports = {
  generateFilePath
};
