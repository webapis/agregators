const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { walkSync } = require('./walkSync');

function pageComponentAttacher({ source, innterHtmlTo, inputFolder,taskSequelizerEventEmitter }) {
  let files = [];
  //console.log('page component attachment started....');
  walkSync(`${process.cwd()}/${inputFolder}`, async function(
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
      files.push(filepath);
    }
  });

  files.forEach(f => {
    const data = fs.readFileSync(f, { encoding: 'utf-8' });
    const dom = new JSDOM(data);
    const document = dom.window.document;

    document[innterHtmlTo].innerHTML = source;

    const content = dom.serialize();
    fs.writeFileSync(f, content);
  });

  console.log('page component attachment ended....');
  taskSequelizerEventEmitter.emit('taskComplete', 'page_component_attacher')
  //return true;
}

module.exports = { pageComponentAttacher };
