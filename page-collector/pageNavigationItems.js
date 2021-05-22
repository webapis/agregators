const { walkSync } = require('./walkSync');
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const dirTree = require('directory-tree');
const { JSDOM } = require('jsdom');
function pageNavigationItems() {
  let files = [];

  console.log('page nav item collection started....');

  const dir = `${process.cwd()}/page-list-pages/tr/moda`;

  walkSync(dir, filepath => {
    files.push(filepath.substring(filepath.indexOf('/tr/') + 3));
  });
  const dom = new JSDOM(``);
  const { document } = dom.window;

  files.forEach(f => {
    const relpath = f.substring(f.indexOf('/moda'));

    const dr = path.dirname(relpath);
    const pathNames = dr.split('/').filter(f => f !== '');
    let id = '';
    pathNames.forEach((p, i, array) => {
      id += '/' + p;
      let element = document.getElementById(id);
      if (!element) {
        let el = document.createElement('ul');
        el.id = id;
        if (i === 0) {
          document.body.appendChild(el);
        } else {
          let parentid = id.replace(`/${p}`, '');
          let childel = document.createElement('ul');
          childel.id = id;
          let parentElement = document.getElementById(parentid);
          parentElement.appendChild(childel);
        }
      }

      if (array.length - 1 === i && i > 0) {
        let parentid = id.replace(`/${p}`, '');

        let fileName = path.basename(relpath, '.html');
        let childel = document.createElement('a');
        childel.id = fileName;
        childel.href = relpath;
        childel.textContent = fileName;
        let parentElement = document.getElementById(parentid);
        if (!parentElement) {
          debugger;
        }
        parentElement.appendChild(childel);
      }
    });
  });
  const content = dom.serialize();
  const dirName = `${process.cwd()}/page-navigation`;
  makeDir.sync(dirName);
  fs.writeFileSync(`${dirName}/nav.html`, content);
  debugger;
  // const tree = dirTree(dir, {}, function(item, PATH, stats) {
  //   const relpath = PATH.substr(PATH.indexOf('/moda/'));
  //   const { type } = item;
  //   let xpath = relpath;
  //   if (type === 'file') {
  //     xpath = relpath.substring(0, relpath.lastIndexOf('/'));
  //   }
  //   debugger;
  // });
  debugger;
  console.log('page nav item collection ended....');
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

module.exports = {
  pageNavigationItems
};
