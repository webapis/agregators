const initState = {
  selected: 'defacto_counter',
  selected_pl_tab: 'urunler',
  items: {}
};

var reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_MARKA_COUNT:
      return { ...state, selected: action.payload };
    case actionTypes.PL_PAGE_TAB_SELECTED:
      return { ...state, selected_pl_tab: action.payload };
    case actionTypes.PRODUCT_ITEMS_SET:
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

const actionTypes = {
  SELECTED_MARKA_COUNT: 'SELECTED_MARKA_COUNT',
  PL_PAGE_TAB_SELECTED: 'PL_PAGE_TAB_SELECTED',
  PRODUCT_ITEMS_SET: 'PRODUCT_ITEMS_SET'
};

export default reducer;
export { actionTypes, initState };
