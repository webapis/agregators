const fs = require('fs');
function metaCreator({ input, output }) {
  const data = fs.readFileSync(input, { encoding: 'utf-8' });
  const dataObject = JSON.parse(data);
  debugger;
  const uniqueProductNames =dataObject

  debugger;
}

module.exports = {
  metaCreator
};
