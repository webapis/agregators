 const initState = {
  selected: 'defacto_counter',
  selected_pl_tab: 'urunler-tab',
  items: null,
  pattern: '',
  autoscroll: true,
  scrollTop: 0
};

const reducer= (state, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_MARKA_COUNT:
      return { ...state, selected: action.payload };
    case actionTypes.PL_PAGE_TAB_SELECTED:
      return { ...state, selected_pl_tab: action.payload };
    case actionTypes.PRERENDER_DATA:
      return { ...state, items: action.payload };
    case actionTypes.PATTERN_SELECTED:
      return {
        ...state,
        pattern: action.payload,
        selected_pl_tab: 'urunler-tab',
        autoscroll: false
      };
    case actionTypes.CLEAR_PATTERN:
      return { ...state, pattern: '', autoscroll: true };
    case actionTypes.PAGE_SCROLLED:
      return { ...state, scrollTop: action.payload };
    default:
      return state;
  }
};

 const actionTypes = {
  SELECTED_MARKA_COUNT: 'SELECTED_MARKA_COUNT',
  PL_PAGE_TAB_SELECTED: 'PL_PAGE_TAB_SELECTED',
  PRODUCT_ITEMS_SET: 'PRODUCT_ITEMS_SET',
  PATTERN_SELECTED: 'PATTERN_SELECTED',
  CLEAR_PATTERN: 'CLEAR_PATTERN',
  SCROLLED_TOP: 'SCROLLED_TOP',
  PAGE_SCROLLED: 'PAGE_SCROLLED',
  PRERENDER_DATA: 'PRERENDER_DATA',
//  IMG_TAGS_LOADED: 'IMG_TAGS_LOADED'
};


window.actionTypes=actionTypes
window.initState=initState
window.reducer=reducer

