const { generateFilePath } = require('./generateFilePath');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { walkSync } = require('./walkSync');

function pageScriptAttacher({ scripts,taskSequelizerEventEmitter }) {

  scripts.forEach(script => {
    const {
      inputFolder,
      prop,
      tag,
      source,
      appendTo,
      cdn,
      rel
    } = script
    let files = [];
    console.log('page script atachment started....');
    walkSync(`${process.cwd()}/${inputFolder}`, async function (
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
      const headTag = document.createElement('meta');
      headTag.name = 'env';
      headTag.content = 'dev';
      document.head.appendChild(headTag);
      source.forEach(s => {
        const scr = document.createElement(tag);
        if (rel) {
          scr.rel = rel;
        }
        if (cdn) {
          scr[prop] = s;
        } else {
          const relativePath = generateFilePath({
            filePath: f.substring(f.indexOf(process.env.projectName))
          });
          
          scr[prop] = `${relativePath}${s}`;
        }
        document[appendTo].appendChild(scr);
      });
      const content = dom.serialize();
      fs.writeFileSync(f, content);
    });
  })

  taskSequelizerEventEmitter.emit('taskComplete', 'page_script_attacher')


}

module.exports = { pageScriptAttacher };


