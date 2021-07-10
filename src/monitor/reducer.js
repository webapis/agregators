const stateFromLS = JSON.parse(localStorage.getItem('page-store'));
export const initState = stateFromLS
  ? stateFromLS
  : {
    user: null,
    projectName: '',
    projectDescription: '',
    projectNames: [],
    view: 'project-list',
    selectedProjectName: '',
    companyName:'',
    error: null
  };

export default (state, action) => {
  switch (action.type) {
    case actionTypes.COMPANY_NAME_CHANGED:
      return { ...state, companyName: action.payload };
    case actionTypes.SIGNED_IN:
      return { ...state, user: action.payload };
    case actionTypes.SIGNED_OUT:
      return { ...state, user: null};
    case actionTypes.PROJECT_NAME_CHANGED:
      return { ...state, projectName: action.payload };
    case actionTypes.PROJECT_START_REQUIRED:
      return { ...state, [action.payload]: true };
    case actionTypes.PROJECT_DESCRIPTION_CHANGED:
      return { ...state, projectDescription: action.payload };
    case actionTypes.PROJECT_START_NOT_REQUIRED:
      return { ...state, [action.payload]: false };
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
    case actionTypes.ERROR_DISMISSED:
      return {
        ...state,
        error: null
      };
      case actionTypes.ERROR:
        debugger;
        return {
          ...state,
          error: action.payload
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
  PROJECT_DESCRIPTION_CHANGED: 'PROJECT_DESCRIPTION_CHANGED',
  VIEW_CHANGED: 'VIEW_CHANGED',
  PROJECT_NAME_SELECTED: 'PROJECT_NAME_SELECTED',
  ERROR_DISMISSED: "ERROR_DISMISSED",
  ERROR:"ERROR",
  COMPANY_NAME_CHANGED:'COMPANY_NAME_CHANGED'
};
