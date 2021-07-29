const { walkSync } = require('./walkSync');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');
const { generateFilePath } = require('../utils/generateFilePath')
const { pageResources } = require('./project.resources')
const makeDir = require('make-dir');

async function pageGeneration({ taskSequelizerEventEmitter }) {

  try {

    let files = [];
    console.log('page genegation started....');
    walkSync(`${process.cwd()}/page-leave`, async function (filepath) {
      files.push(filepath);
    });
    const firstJson = files.filter(f => f.includes('-0.json'));
    let i = 0;
    for (i = 0; i < firstJson.length; i++) {

      let htmlOutput = '';
      const pageName = path.basename(firstJson[i], '.json').replace(/-0.*/i, '');
      const lastFolder = firstJson[i]
        .substring(firstJson[i].lastIndexOf('/') + 1)
        .replace('-0.json', '');
      if (lastFolder === pageName) {
        htmlOutput = `${path.dirname(firstJson[i])}`
          .replace(`/${lastFolder}`, '')
          .replace('page-leave', 'page-list-pages');
      } else {
        htmlOutput = `${path.dirname(firstJson[i])}`.replace(
          'page-leave',
          'page-list-pages'
        );
      }
      debugger
      makeDir.sync(htmlOutput);
      const dom = new JSDOM(
        `<body>
        <div id="root"></div>
       </body>`,
        { includeNodeLocations: true });
      const scripts = pageResources[process.env.projectName].script
      const cssFromCdn = pageResources[process.env.projectName].cssFromCdn
      const localCss = pageResources[process.env.projectName].localCss
      
      
      scripts.forEach(s => {
        addScriptTag({ filePath: htmlOutput, file: s, document: dom.window.document })
      })

      cssFromCdn.forEach(href => {
        addCssFromCdn({ href, document: dom.window.document })
      })

      localCss.forEach(s => {
        addCssLocal({ filePath: htmlOutput, file: s, document: dom.window.document })
      })

      
      const content = dom.serialize();
      console.log('page generatred', `${htmlOutput}/${pageName}.html`)
      fs.writeFileSync(`${htmlOutput}/${pageName}.html`, content);
      if (firstJson.length - 1 === i) {

      }
    }
    taskSequelizerEventEmitter.emit('taskComplete', 'page_generation')
    // console.log('page genegation ended....');


  } catch (error) {
    
  }
}

module.exports = { pageGeneration };


function addScriptTag({ filePath, file, document }) {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = `${generateFilePath({ filePath })}/${file}`;
  document.body.appendChild(s);
};

function addCssFromCdn({ href, document }) {
  var s = document.createElement('link');
  s.rel = 'stylesheet';
  s.setAttribute("type", "text/css");
  s.href = href;
  document.head.appendChild(s);
};
function addCssLocal({ filePath, file, document}) {
  var s = document.createElement('link');
 // s.rel = 'stylesheet';
  s.setAttribute("type", "text/css");
  s.href = `${generateFilePath({ filePath })}/${file}`;
  
  document.body.prepend(s);
};