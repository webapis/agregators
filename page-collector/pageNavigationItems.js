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

        if (!element) {
          if (i === 5) {
            let element = document.createElement('li');
            element.id = id;
            parentElement.appendChild(element);
          } else {
            let element = document.createElement('ul');

            let container = document.createElement('div');
            container.classList.add('collapse');

            container.id = id;
            element.appendChild(container);

            // element.classList.add('collapse');

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
      const spn = document.createElement('ul');
      //spn.setAttribute('data-bs-toggle', 'collapse');
      spn.setAttribute('data-bs-target', id);
      spn.setAttribute('aria-expanded', true);
      spn.setAttribute('role', 'button');
      spn.textContent = textContent;
      spn.classList.add('arrow');
      //spn.classList.add('btn');
      element.parentNode.prepend(spn);
    } else {
      const a = document.createElement('a');
      a.href = `/tr/${f}`;
      a.textContent = textContent;
      element.prepend(a);
    }
  });
  document.querySelectorAll('*').forEach(node => {
    const str = node.id;
    if (str && str !== '' && str.includes('/')) {
      const replaced = str.replace(/\//g, '-');

      node.setAttribute('id', replaced);
    }
  });
  document.querySelectorAll('*').forEach(node => {
    const str = node.getAttribute('data-bs-target');
    if (str && str !== '' && str.includes('/')) {
      const replaced = str.replace(/\//g, '-');
      debugger;
      node.setAttribute('data-bs-target', replaced);
    }
  });
  //--------
  const content = `<div class="side-nav">${document.body.innerHTML}</div>`;
  const dirName = `${process.cwd()}/page-navigation`;
  makeDir.sync(dirName);
  fs.writeFileSync(`${dirName}/nav.html`, content);
  debugger;

  console.log('page nav item collection ended...');
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function comId(str) {
  if (str && str !== '' && str.includes('/')) {
    const replaced = str.replace(/\//, '-');
    debugger;
    return replaced;
  }
  return str;
}

module.exports = {
  pageNavigationItems
};
