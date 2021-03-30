export const initState = {
  selected: 'defacto_counter',
  selected_pl_tab: 'urunler',
  items: {},
  pattern: ''
};

export default (state, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_MARKA_COUNT:
      return { ...state, selected: action.payload };
    case actionTypes.PL_PAGE_TAB_SELECTED:
      return { ...state, selected_pl_tab: action.payload };
    case actionTypes.PRODUCT_ITEMS_SET:
      return { ...state, items: action.payload };
    case actionTypes.PATTERN_SELECTED:
      return { ...state, pattern: action.payload };
    default:
      return state;
  }
};

export const actionTypes = {
  SELECTED_MARKA_COUNT: 'SELECTED_MARKA_COUNT',
  PL_PAGE_TAB_SELECTED: 'PL_PAGE_TAB_SELECTED',
  PRODUCT_ITEMS_SET: 'PRODUCT_ITEMS_SET',
  PATTERN_SELECTED: 'PATTERN_SELECTED'
};
