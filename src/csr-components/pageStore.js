Promise.all([
  import('./air-store.js'),
  import('./reducer.js'),
  import('./df-product-view.js'),
  import('./pl-page-tabs.js')
]).then(function(modules) {
  window.pageStore = modules[0].createStore(
    modules[1].default,
    modules[1].initState,
    'page-store'
  );
  window.actionTypes = modules[1].actionTypes;
  const url = window.pageUrl;
  window.onpagestore();
  fetch(url).then(response => response.json()).then(items => {
    console.log('window.pageStoress|||||||', window.pageStore);
    window.pageStore.dispatch({
      type: window.actionTypes.PRODUCT_ITEMS_SET,
      payload: items
    });
  });
});
