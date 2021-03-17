export const initState = { selected: 'defacto_counter' };

export default (state, action) => {
  
  switch (action.type) {
    case actionTypes.SELECTED_MARKA_COUNT:
      
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};

export const actionTypes = {
  SELECTED_MARKA_COUNT: 'SELECTED_MARKA_COUNT'
};
