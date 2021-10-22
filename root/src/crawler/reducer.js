const stateFromLS = JSON.parse(localStorage.getItem('page-store'));
export const initState = stateFromLS
  ? stateFromLS
  : {
    auth: null,
    projectName: '',
    description: '',
    projectNames: [],
    // currentPage: 'home',
    selectedDashboard: '',
    // projects: [{ projectName: 'projectOne' }, { projectName: 'projectTwo' }, { projectName: 'projectTrhee' }],
    selectedProjectName: '',
    companyName: '',
    dashboardTab: 'main-tab',
    navAfterAuth: 'home',
    // emailService: '',
    // databaseService: '',
    // exportService: '',
    // scheduleService: '',
    emailToEdit: { key: '', email: '' },
    error: null,
    loading: false,
    //  settingsServiceTab: 'email-tab',
    emaillist: [],
    googleServiceScopes: 'https://www.googleapis.com/auth/userinfo.email',
    githubServiceScopes: '',
    startScrapingClicked: false,
    runId: 0,
    completeTime: 0,
    selectedProjectTab: 'project-workflows',
    workflowEditor: { workflowName: '', workflowDescription: '', ownersRepos: [], selectedRepo: '', isPrivate: '', selectedBranch: '', workflowName: '', tokenFPR: '' },
    workflowList: { workflowTab: 'private-workflows', workflows: [] },
    workspaceList: { workspaces: [] },
    workspaceDashboard: { selectedTab: 'workflows-tab', selectedWfContainerTab: 'collection-tab', containers: [], selectedContainer: '', selectedWfContainerEditorTab: 'workflows-tab' },
    workspace: { workspaceSelected: '' },
    containerName: { name: '' },
    wfContainer: { selectedContainer: '' },
    workflowTree: { workflowPath: '' }
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
    case actionTypes.SET_GH_TKN:
      debugger
      return { ...state, auth: { ...state.auth, gh_tkn: action.payload.gh_tkn, gh_user: action.payload.gh_user } }
    case actionTypes.ID_TOKEN_UPDATED:
      return { ...state, auth: { ...state.auth, ...action.payload, timestamp: Date.now() + 3600000 } }
    case actionTypes.PROJECT_SELECTED:
      debugger;
      return { ...state, ...action.payload }
    case actionTypes.GITHUB_INITIALIZATION_CHANGED:
      return { ...state, githubInitialization: { ...state.githubInitialization, ...action.payload } }
    case actionTypes.PROJECT_EDITOR_TAB_CHANGED:
      return { ...state, selectedProjectTab: action.payload }
    case actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED:
      return { ...state, workflowEditor: { ...state.workflowEditor, [action.payload.input]: action.payload.value } }
    case actionTypes.WORKFLOW_TAB_CHANGED:
      return { ...state, workflowList: { ...state.workflowList, workflowTab: action.payload } }
    case actionTypes.USER_REPOS_FETCHED:
      return { ...state, workflowEditor: { ...state.workflowEditor, ownersRepos: action.payload } }
    case actionTypes.REPOS_BRANCHES_FETCHED:
      return { ...state, workflowEditor: { ...state.workflowEditor, repoBranches: action.payload } }
    case actionTypes.REPO_SELECTED:

      return { ...state, workflowEditor: { ...state.workflowEditor, isPrivate: action.payload.isPrivate, selectedRepo: action.payload.selectedRepo, workflowName: `${state.auth.screenName}_${action.payload.selectedRepo}_${state.workflowEditor.selectedBranch}` } }
    case actionTypes.BRANCH_SELECTED:

      return { ...state, workflowEditor: { ...state.workflowEditor, selectedBranch: action.payload, workflowName: `${state.auth.screenName}_${state.workflowEditor.selectedRepo}_${action.payload}` } }
    case actionTypes.TOKEN_FPR_CHANGED:
      return { ...state, workflowEditor: { ...state.workflowEditor, tokenFPR: action.payload } }
    case actionTypes.WORKFLOWS_FETCHED:
      return { ...state, workflowList: { workflows: action.payload } }
    case actionTypes.WORKFLOW_UPDATED:
      return { ...state, workflowEditor: { workflowName: '', workflowDescription: '', ownersRepos: [], selectedRepo: '', isPrivate: '', selectedBranch: '', workflowName: '', tokenFPR: '' } }
    case actionTypes.EDIT_WORKFLOW:
      return { ...state, workflowEditor: { ...state.workflowEditor, ...action.payload } }
    case actionTypes.WORKSPACE_NAME_CHANGED:
      return { ...state, workspaceName: action.payload }
    case actionTypes.WORKSPACES_FETCHED:
      return { ...state, workspaceList: { ...state.workspaceList, workspaces: action.payload } }
    case actionTypes.WORKSPACE_SELECTED:
      return { ...state, workspace: { ...state.workspace, workspaceSelected: action.payload } }
    case actionTypes.CONTAINER_NAME_CHANGED:
      return { ...state, containerName: { ...state.containerName, name: action.payload } }
    case actionTypes.CONTAINERS_FETCHED:
      return { ...state, workspaceDashboard: { ...state.workspaceDashboard, containers: action.payload } }
    case actionTypes.WF_CONTAINER_SELECTED:
      return { ...state, wfContainer: { ...state.wfContainer, selectedContainer: action.payload } }

    case actionTypes.CONTAINER_NAME_SAVED:
      return { ...state, containerName: { name: '' } }
    case actionTypes.WORKFLOW_PATH_CHANGED:
      debugger;
      return { ...state, workflowTree: { workflowPath: action.payload } }
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
  RUN_COMPLETE: 'RUN_COMPLETE',
  SET_GH_TKN: 'SET_GH_TKN',
  ID_TOKEN_UPDATED: 'ID_TOKEN_UPDATED',
  PROJECT_SELECTED: 'PROJECT_SELECTED',
  GITHUB_INITIALIZATION_CHANGED: 'GITHUB_INITIALIZATION_CHANGED',
  PROJECT_EDITOR_TAB_CHANGED: 'PROJECT_EDITOR_TAB_CHANGED',
  WORKFLOW_EDITOR_INPUT_CHANGED: 'WORKFLOW_EDITOR_INPUT_CHANGED',
  WORKFLOW_TAB_CHANGED: 'WORKFLOW_TAB_CHANGED',
  USER_REPOS_FETCHED: 'USER_REPOS_FETCHED',
  REPOS_BRANCHES_FETCHED: 'REPOS_BRANCHES_FETCHED',
  REPO_SELECTED: 'REPO_SELECTED',
  BRANCH_SELECTED: 'BRANCH_SELECTED',
  TOKEN_FPR_CHANGED: 'TOKEN_FPR_CHANGED',
  WORKFLOWS_FETCHED: 'WORKFLOWS_FETCHED',
  WORKFLOW_UPDATED: 'WORKFLOW_UPDATED',
  EDIT_WORKFLOW: 'EDIT_WORKFLOW',
  WORKSPACE_NAME_CHANGED: 'WORKSPACE_NAME_CHANGED',
  WORKSPACES_FETCHED: 'WORKSPACES_FETCHED',
  WORKSPACE_SELECTED: 'WORKSPACE_SELECTED',
  // WS_DASHBOARD_TAB_CHANGED: 'WS_DASHBOARD_TAB_CHANGED',
  // WF_CONTAINER_TAB_CHANGED: 'WF_CONTAINER_TAB_CHANGED',
  CONTAINER_NAME_CHANGED: 'CONTAINER_NAME_CHANGED',
  CONTAINERS_FETCHED: 'CONTAINERS_FETCHED',
  WF_CONTAINER_SELECTED: 'WF_CONTAINER_SELECTED',
  WF_CONTAINER_EDITOR_TAB_CHANGED: 'WF_CONTAINER_EDITOR_TAB_CHANGED',
  CONTAINER_NAME_SAVED: 'CONTAINER_NAME_SAVED',
  WORKFLOW_PATH_CHANGED: 'WORKFLOW_PATH_CHANGED'

};
