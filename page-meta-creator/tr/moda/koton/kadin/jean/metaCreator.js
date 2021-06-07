const fs = require('fs');
const { filterMeta } = require('./filterMeta');
const { pageMeta } = require('./pageMeta');
function metaCreator({ input, output, pageTitle, output2 }) {
  const data = fs.readFileSync(input, { encoding: 'utf-8' });
  const dataObject = JSON.parse(data);

  filterMeta({ dataObject, output, output2 });
  pageMeta({ dataObject, pageTitle, output, output2 });
}

module.exports = {
  metaCreator
};
