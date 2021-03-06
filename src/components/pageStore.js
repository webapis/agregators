// import { createStore } from './air-store';
// import reducer, { initState } from './reducer';

// export default createStore(reducer, initState, 'page-state');

// import('./air-store').then(module => {
//   const createStore = module;
// });

Promise.all([
  import('./air-store.js'),
  import('./reducer.js')
]).then(modules => {
  window.pageStore = modules[0].createStore(
    modules[1].default,
    modules[1].initState,
    'page-store'
  );
  window.actionTypes = modules[1].actionTypes;
});
