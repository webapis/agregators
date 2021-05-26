const { walkSync } = require('./walkSync');
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { JSDOM } = require('jsdom');
function pageNavigationItems() {
  let files = [];

  console.log('page nav item collection started....');

  const dir = `${process.cwd()}/page-list-pages/`;

  walkSync(dir, filepath => {
    files.push(filepath.substring(filepath.indexOf('moda')));
  });
  const dom = new JSDOM(``);
  const { document } = dom.window;
  //--------
  let i = 1;
  while (i < 6) {
    let mapped = files.map(f =>
      f.substring(0, getPosition(f, '/', i)).replace('.html', '')
    );

    if (i === 1) {
      mapped.forEach(m => {
        let id = m;
        let element = document.getElementById(id);
        if (!element) {
          let element = document.createElement('ul');
          element.id = id;
          document.body.appendChild(element);
        }
      });
    } else {
      mapped.forEach(m => {
        let id = m;
        const parentId = m.substring(0, getPosition(m, '/', i - 1));
        let parentElement = document.getElementById(parentId);

        let element = document.getElementById(id);
        debugger;
        if (!element) {
          if (i === 5) {
            let element = document.createElement('li');
            element.id = id;
            parentElement.appendChild(element);
          } else {
            let element = document.createElement('ul');
            element.id = id;
            element.classList.add('nested');
            parentElement.appendChild(element);
          }
        }
      });
    }

    i++;
  }

  files.forEach(f => {
    const id = f.replace('.html', '');
    const moreThanOne = files.filter(f => f.includes(id)).length;
    const element = document.getElementById(id);
    const textContent = path.basename(f, '.html').replace('-', ' ');
    if (moreThanOne > 1) {
      const a = document.createElement('a');
      a.href = `/tr/${f}`;
      a.textContent = `tümü (${textContent})`;
      let li = document.createElement('li');
      li.appendChild(a);
      element.prepend(li);
      const spn = document.createElement('div');
      spn.textContent = textContent;
      spn.classList.add('caret');
      element.prepend(spn);
      debugger;
    } else {
      const a = document.createElement('a');
      a.href = `/tr/${f}`;
      a.textContent = textContent;
      element.prepend(a);
    }
  });

  //--------
  const content = document.body.innerHTML;
  const dirName = `${process.cwd()}/page-navigation`;
  makeDir.sync(dirName);
  fs.writeFileSync(`${dirName}/nav.html`, content);
  debugger;

  console.log('page nav item collection ended....');
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

module.exports = {
  pageNavigationItems
};
