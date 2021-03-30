import './csr-components/product-list';

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

addLinkTag({
  href:
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css'
});

//window.pageUrl = './defacto-kadin-jean-pantolon.json';
document.body.innerHTML = `<product-list></product-list>`;
