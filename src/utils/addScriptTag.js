export default ({src})=>{
    var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = '../components/df-product-view.js';
      document.body.appendChild(s);
}