export const initState = {
  selected: 'defacto_counter',
  selected_pl_tab: 'secenekler'
};

export default (state, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_MARKA_COUNT:
      return { ...state, selected: action.payload };
    case actionTypes.PL_PAGE_TAB_SELECTED:
      return { ...state, selected_pl_tab: action.payload };
    default:
      return state;
  }
};

export const actionTypes = {
  SELECTED_MARKA_COUNT: 'SELECTED_MARKA_COUNT',
  PL_PAGE_TAB_SELECTED: 'PL_PAGE_TAB_SELECTED'
};
