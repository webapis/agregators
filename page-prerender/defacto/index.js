const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const makeDir = require('make-dir');
const items = require(`./page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json`);
async function prerender() {
  const outputDir = `./build`;
  await makeDir(outputDir);
  const filePath = `${outputDir}/index.html`;
  const {
    window: { document }
  } = new JSDOM(`<!DOCTYPE html><div id="root">Hello world</div>`, {
    runScripts: 'outside-only'
  });
  addLinkTag({
    href:
      'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
    document
  });
  document.body.innerHTML = `<div class="container">
    <pl-page-tabs></pl-page-tabs>
   <div  id="root" class="container-fluid">
   <div id="urun-container" class="row"></div>
   <div id="secenekler-container" class="row">Secenekler<div>
   </div>
   <script src="components/pageStore.js" type="text/javascript"></script>
</div>
`;
  debugger;
  const root = document.getElementById('root');
  debugger;
  document.title = items.pageTitle;
  const descriptionTag = document.createElement('meta');
  descriptionTag.type = 'description';
  descriptionTag.content = items.pageDescription;
  document.querySelector('head').appendChild(descriptionTag);
  items.items.filter((it, i) => i < 76).forEach(item => {
    const {
      detailLink,
      productName,
      price: { salePrice, marketPrice },
      discount: { discountRate, discountText },
      image: { scrset, placeHolder }
    } = item;

    var node = document.createElement('product-view');

    node.classList.add('col-sm-6');
    node.classList.add('col-xl-3');
    node.setAttribute('title', productName);
    node.setAttribute('salePrice', salePrice);
    node.setAttribute('marketPrice', marketPrice);
    node.setAttribute('discountRate', discountRate);
    node.setAttribute('discountText', discountText);
    node.setAttribute('detailLink', detailLink);
    node.setAttribute('srcset', scrset);
    node.setAttribute('placeHolder', placeHolder);
    document.getElementById('urun-container').appendChild(node);
  });
  debugger;
  const content = document.documentElement.outerHTML;
  fs.writeFileSync(filePath, content);
  return content;
}

module.exports = {
  prerender
};

function addLinkTag({ href, document }) {
  var s = document.createElement('link');

  s.rel = 'stylesheet';
  s.href = href;
  document.head.appendChild(s);
}
