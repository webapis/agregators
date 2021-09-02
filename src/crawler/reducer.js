const stateFromLS = JSON.parse(localStorage.getItem('page-store'));
export const initState = stateFromLS
  ? stateFromLS
  : {
    auth: null,
    projectName: '',
    description: '',
    projectNames: [],
    currentPage: 'home',
    selectedDashboard: '',
    projects: [{ projectName: 'projectOne' }, { projectName: 'projectTwo' }, { projectName: 'projectTrhee' }],
    selectedProjectName: '',
    companyName: '',
    dashboardTab: 'main-tab',
    navAfterAuth: 'home',
    emailService: '',
    databaseService: '',
    exportService: '',
    scheduleService: '',
    emailToEdit: { key: '', email: '' },
    error: null,
    loading: false,
    settingsServiceTab: 'email-tab',
    emaillist: [],
    googleServiceScopes: 'https://www.googleapis.com/auth/userinfo.email',
    githubServiceScopes: '',
    startScrapingClicked: false,
    runId: 0,
    completeTime: 0
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
    case actionTypes.PROJECT_EDITOR_SELECTED:
      return { ...state, projectName: action.payload.projectName, description: action.payload.description }
    case actionTypes.ADD_PROJECT_TEMPLATE:
      return { ...state, projectName: '', description: '' }
    case actionTypes.PAGE_NAVIGATED:
      return { ...state, currentPage: action.payload }
    case actionTypes.ACCOUNT_TYPE_CHANGED:
      return { ...state, [action.payload.serviceName]: action.payload.accountType }
    case actionTypes.SET_ALL_ACCOUNT_TYPES:
      return { ...state, ...action.payload }
    case actionTypes.EDIT_EMAIL:
      return { ...state, emailToEdit: { key: action.payload.key, email: action.payload.email } }
    case actionTypes.SET_EMAIL_LIST:
      return { ...state, emaillist: action.payload }
    case actionTypes.SETTINGS_SERVICE_TAB_CHANGED:
      return { ...state, settingsServiceTab: action.payload }
    case actionTypes.GOOGLE_SERVICE_SCOPE_ADDED:
      const nextState = { ...state, googleServiceScopes: state.googleServiceScopes.concat(' ').concat(action.payload) }
      return nextState
    case actionTypes.GOOGLE_SERVICE_SCOPE_REMOVED:
      return { ...state, googleServiceScopes: state.googleServiceScopes.replace(action.payload, '').replace(/  +/g, '').replace(/\s$/g, '') }
    case actionTypes.START_SCRAPING_CLICKED:
      return { ...state, startScrapingClicked: true, runId: Date.now(), completeTime: 0 }
    case actionTypes.RUN_COMPLETE:
      debugger;
      return { ...state, startScrapingClicked: false, completeTime: action.payload }
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
  PROJECT_SAVED: 'PROJECT_SAVED',
  PROJECT_EDITOR_SELECTED: 'PROJECT_EDITOR_SELECTED',
  ADD_PROJECT_TEMPLATE: 'ADD_PROJECT_TEMPLATE',
  PAGE_NAVIGATED: 'PAGE_NAVIGATED',
  ACCOUNT_TYPE_CHANGED: 'ACCOUNT_TYPE_CHANGED',
  SET_ALL_ACCOUNT_TYPES: 'SET_ALL_ACCOUNT_TYPES',
  EDIT_EMAIL: 'EDIT_EMAIL',
  SET_EMAIL_LIST: 'SET_EMAIL_LIST',

  SETTINGS_SERVICE_TAB_CHANGED: 'SETTINGS_SERVICE_TAB_CHANGED',
  GOOGLE_SERVICE_SCOPE_ADDED: 'GOOGLE_SERVICE_SCOPE_ADDED',
  GOOGLE_SERVICE_SCOPE_REMOVED: 'GOOGLE_SERVICE_SCOPE_REMOVED',
  START_SCRAPING_CLICKED: 'START_SCRAPING_CLICKED',
  GH_ACTION_TRIGGERED: 'GH_ACTION_TRIGGERED',
  GH_ACTION_TRIGGERE_FAILED: 'GH_ACTION_TRIGGERE_FAILED',
  RUN_COMPLETE: 'RUN_COMPLETE'

};
