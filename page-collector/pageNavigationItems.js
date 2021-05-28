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
  const allLinks = [];
  files.forEach(f => {
    const pathNames = f.substring(0, f.lastIndexOf('/')).split('/');
    let id = '';
    pathNames.forEach((p, i) => {
      id += i === 0 ? p : `-${p}`;

      let parentId = id.replace(`-${p}`, '');
      let parentElement = parentId
        ? document.getElementById(parentId)
        : document.body;
      if (!parentElement) {
        debugger;
        parentElement = document.createElement('ul');
        parentElement.id = parentId;
        let span = document.createElement('li');
        span.textContent = p;
        span.classList.add('arrow');

        span.setAttribute('aria-expanded', 'false');
        span.setAttribute('data-bs-toggle', 'collapse');
        span.setAttribute('data-bs-target', id);
        document.body.prepend(span);
        document.body.appendChild(parentElement);
      }
      let element = document.getElementById(id);
      if (!element) {
        let element = document.createElement('ul');

        let linkFromParent = `/tr/` + parentId.replace(/-/g, '/') + '.html';

        if (!document.querySelector(`[href='${linkFromParent}']`)) {
          let pageName = path.basename(linkFromParent);
          if (pageName !== '.html') {
            let linkElementParent = document.createElement('li');
            let a = document.createElement('a');
            a.href = linkFromParent;
            let textContent = 'tüm ' + path.basename(linkFromParent, '.html');
            if (textContent === 'tüm moda') {
              debugger;
              const tagName = parentElement.tagName;
              debugger;
            }
            a.textContent = textContent;
            linkElementParent.appendChild(a);

            parentElement.appendChild(linkElementParent);
          }
        }

        let span = document.createElement('li');
        span.textContent = p;
        span.classList.add('arrow');

        span.setAttribute('aria-expanded', 'false');
        span.setAttribute('data-bs-toggle', 'collapse');
        span.setAttribute('data-bs-target', id);
        parentElement.appendChild(span);

        element.id = id;
        element.classList.add('collapse');
        parentElement.appendChild(element);
      }
    });
    let parentId = f.substring(0, f.lastIndexOf('/')).replace(/\//g, '-');
    let fileName = path.basename(f, '.html');
    let parentElement = document.getElementById(parentId);
    let uniqueNames = files.map(f => f.substring(0, f.lastIndexOf('/')));
    const file = uniqueNames.find(f => f.includes(fileName));

    if (!file) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.textContent = fileName.replace(/-/g, ' ');
      a.href = `/tr/` + f;

      li.appendChild(a);
      parentElement.appendChild(li);
    } else {
      allLinks.push(file);
    }
  });
  let allLinksWithoutDublicate = allLinks.filter(function(item, pos) {
    return allLinks.indexOf(item) == pos;
  });
  allLinksWithoutDublicate.forEach(file => {
    let fileName = path.basename(file, '.html');
    const parentId = file.replace(/\//g, '-');
    const parentElement = document.getElementById(parentId);

    let li = document.createElement('li');
    let a = document.createElement('a');
    a.textContent = 'tüm ' + fileName.replace(/-/g, ' ');
    let href = `/tr/` + file + '.html';
    debugger;
    a.href = href;
    li.appendChild(a);
    parentElement.prepend(li);
  });

  debugger;

  // --------
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

module.exports = {
  pageNavigationItems
};
