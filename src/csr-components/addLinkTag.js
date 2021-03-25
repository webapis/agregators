const addLinkTag = ({ href }) => {
  var s = document.createElement('link');
  s.rel = 'stylesheet';
  s.href = href;
  document.head.appendChild(s);
};

export { addLinkTag };
