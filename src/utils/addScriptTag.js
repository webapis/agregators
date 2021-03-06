export default function ({src, document}){
  debugger;
    var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src =src;
      debugger;
      document.body.appendChild(s);
}