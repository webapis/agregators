const { walkSync } = require('./walkSync');
const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { JSDOM } = require('jsdom');
function pageNavigationItems({  taskSequelizerEventEmitter}) {

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
    let id = '';
    const pathNames = f.substring(0, f.lastIndexOf('/')).split('/');

    let i;
    for (i = 0; i < pathNames.length; i++) {
      let p = pathNames[i];

      //  pathNames.forEach((p, i) => {
      id += i === 0 ? p : `/${p}`;
      if (id === '') {
        continue;
      }
      let parentId = id.replace(`/${p}`, '');
      let parentElement = parentId
        ? document.getElementById(parentId)
        : document.body;
      if (!parentElement) {
        parentElement = document.createElement('ul');
        parentElement.id = parentId;
        let span = document.createElement('li');
        span.textContent = 'Anasayfa'; //p.replace('-', ' ');
        span.classList.add('arrow');
        span.classList.add('text-capitalize');
        span.setAttribute('aria-expanded', 'true');
        span.setAttribute('data-bs-toggle', 'collapse');
        span.setAttribute('data-bs-target', id);
        document.body.prepend(span);
        document.body.appendChild(parentElement);
      }
      let element = document.getElementById(id);
      if (!element) {
        let element = document.createElement('ul');

        let linkFromParent = `/` + parentId + '.html';
        if (!document.querySelector(`[href='${linkFromParent}']`)) {
          let pageName = path.basename(linkFromParent);
          if (pageName !== '.html') {
            let linkElementParent = document.createElement('li');
            let a = document.createElement('a');
            a.href = linkFromParent;

            a.classList.add('text-capitalize');
            a.setAttribute('aria-selected', 'false');
            let textContent = 'Tümümi göster'; //'tüm ' + path.basename(linkFromParent, '.html');

            a.textContent = textContent;
            linkElementParent.appendChild(a);

            parentElement.appendChild(linkElementParent);
          }
        }

        let span = document.createElement('li');
        span.textContent = p.replace('-', ' ');
        span.classList.add('arrow');
        span.classList.add('text-capitalize');
        span.setAttribute('aria-expanded', 'false');
        span.setAttribute('data-bs-toggle', 'collapse');
        span.setAttribute('data-bs-target', id);

        parentElement.appendChild(span);

        element.id = id;
        element.classList.add('collapse');
        parentElement.appendChild(element);
      }
    }
    let parentId = f.substring(0, f.lastIndexOf('/')); //.replace(/\//g, '-');
    let fileName = path.basename(f, '.html');

    let parentElement = document.getElementById(parentId);
    let uniqueNames = files.map(f => f.substring(0, f.lastIndexOf('/')));
    const file = uniqueNames.find(f => f.includes(fileName));

    if (!file) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.textContent = fileName.replace(/-/g, ' ');
      a.classList.add('text-capitalize');
      a.setAttribute('aria-selected', 'false');
      a.href = `/` + f;

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
////
    const parentId = file; 
    const parentElement = document.getElementById(parentId);

    let li = document.createElement('li');
    let a = document.createElement('a');
    a.classList.add('text-capitalize');
    a.setAttribute('aria-selected', 'false');
    a.textContent = 'Tümümi göster';
    let href = `/` + file + '.html';

    a.href = href;
    li.appendChild(a);
    parentElement.prepend(li);
////
  });


  const content = `<div class="side-nav">${document.body.innerHTML}</div>`;
  const dirName = `${process.cwd()}/page-navigation`;
  makeDir.sync(dirName);
  fs.writeFileSync(`${dirName}/nav.html`, content);
  console.log('page nav item collection ended...');
  taskSequelizerEventEmitter.emit('taskComplete', 'page_nav_items')

}


function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

module.exports = {
  pageNavigationItems
};
