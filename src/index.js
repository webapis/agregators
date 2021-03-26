import './ssr-components/product-list-page';


const addScriptTag = ({ src }) => {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;

  document.body.appendChild(s);
};

const addLinkTag = ({ href }) => {
  var s = document.createElement('link');

  s.rel = 'stylesheet';
  s.href = href;
  document.head.appendChild(s);
};

addScriptTag({ src: '../components/pageStore.js' });
addLinkTag({
  href:
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css'
});

window.pageUrl =
  'page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json';
document.body.innerHTML = `<product-list-page > </product-list-page>`;
