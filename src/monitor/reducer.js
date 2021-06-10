const stateFromLS = JSON.parse(localStorage.getItem('page-store'));
export const initState = stateFromLS
  ? stateFromLS
  : {
      user: null,
      projectName: '',
      projectNames: [],
      view: 'project-list',
      selectedProjectName: ''
    };

export default (state, action) => {
  switch (action.type) {
    case actionTypes.SIGNED_IN:
      return { ...state, user: action.payload };
    case actionTypes.SIGNED_OUT:
      return { ...state, user: action.payload };
    case actionTypes.PROJECT_NAME_CHANGED:
      return { ...state, projectName: action.payload };
    case actionTypes.VIEW_CHANGED:
      return {
        ...state,
        view: action.payload
      };
    case actionTypes.PROJECT_NAME_SELECTED:
      return {
        ...state,
        view: 'project-detail',
        selectedProjectName: action.payload
      };
    default:
      return state;
  }
};

export const actionTypes = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  ADD_PROJECT: 'ADD_PROJECT',
  PROJECT_NAME_CHANGED: 'PROJECT_NAME_CHANGED',
  VIEW_CHANGED: 'VIEW_CHANGED',
  PROJECT_NAME_SELECTED: 'PROJECT_NAME_SELECTED'
};
