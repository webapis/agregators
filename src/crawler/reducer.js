const stateFromLS = JSON.parse(localStorage.getItem('page-store'));
export const initState = stateFromLS
  ? stateFromLS
  : {
    auth: null,
    projectName: '',
    description: '',
    projectNames: [],
    contentView: 'projects',
    selectedDashboard: '',
    projects: [{ projectName: 'projectOne' }, { projectName: 'projectTwo' }, { projectName: 'projectTrhee' }],
    selectedProjectName: '',
    companyName: '',
    dashboardTab: 'main-tab',
    navAfterAuth: 'home',
    error: null,
    loading: false
  };

export default (state, action) => {
  switch (action.type) {
    case actionTypes.CONTENT_VIEW_CHANGED:
      return { ...state, contentView: action.payload.view, ...action.payload }
    case actionTypes.DASHBOARD_TAB_CHANGED:
      return { ...state, dashboardTab: action.payload }
    case actionTypes.AUTH_SUCCESS:
      return { ...state, auth: action.payload.auth, contentView: action.payload.navAfterAuth }
    case actionTypes.LOGOUT:
      return { ...state, auth: null }
    case actionTypes.INPUT_CHANGED:
      return { ...state, [action.payload.name]: action.payload.value }
    case actionTypes.LOADING:
      return { ...state, loading: true }
    case actionTypes.LOADING_COMPLETE:
      return { ...state, loading: false }
    case actionTypes.PROJECT_SAVED:
      return { ...state, loading: false, contentView: 'projects' }

    // case actionTypes.COMPANY_NAME_CHANGED:
    //   return { ...state, companyName: action.payload };
    // case actionTypes.SIGNED_IN:
    //   return { ...state, user: action.payload };
    // case actionTypes.SIGNED_OUT:
    //   return { ...state, user: null };
    // case actionTypes.PROJECT_NAME_CHANGED:
    //   return { ...state, projectName: action.payload };
    // case actionTypes.PROJECT_START_REQUIRED:
    //   return { ...state, [action.payload]: true };
    // case actionTypes.PROJECT_DESCRIPTION_CHANGED:
    //   return { ...state, projectDescription: action.payload };
    // case actionTypes.PROJECT_START_NOT_REQUIRED:
    //   return { ...state, [action.payload]: false };
    // case actionTypes.VIEW_CHANGED:
    //   return {
    //     ...state,
    //     view: action.payload
    //   };
    // case actionTypes.PROJECT_NAME_SELECTED:
    //   return {
    //     ...state,
    //     view: 'project-detail',
    //     selectedProjectName: action.payload
    //   };
    // case actionTypes.ERROR_DISMISSED:
    //   return {
    //     ...state,
    //     error: null
    //   };
    // case actionTypes.ERROR:
    //   debugger;
    //   return {
    //     ...state,
    //     error: action.payload
    //   };
    default:
      return state;
  }
};

export const actionTypes = {
  CONTENT_VIEW_CHANGED: 'CONTENT_VIEW_CHANGED',
  //----
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT',
  ADD_PROJECT: 'ADD_PROJECT',
  PROJECT_NAME_CHANGED: 'PROJECT_NAME_CHANGED',
  PROJECT_DESCRIPTION_CHANGED: 'PROJECT_DESCRIPTION_CHANGED',
  VIEW_CHANGED: 'VIEW_CHANGED',
  PROJECT_NAME_SELECTED: 'PROJECT_NAME_SELECTED',
  ERROR_DISMISSED: "ERROR_DISMISSED",
  ERROR: "ERROR",
  COMPANY_NAME_CHANGED: 'COMPANY_NAME_CHANGED',
  DASHBOARD_TAB_CHANGED: 'DASHBOARD_TAB_CHANGED',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  LOGOUT: 'LOGOUT',
  INPUT_CHANGED: 'INPUT_CHANGED',
  LOADING: 'LOADING',
  LOADING_COMPLETE: 'LOADING_COMPLETE',
  PROJECT_SAVED: 'PROJECT_SAVED'
};
