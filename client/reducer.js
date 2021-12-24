const stateFromLS = JSON.parse(localStorage.getItem('page-store'));
export const initState = stateFromLS
  ? stateFromLS
  : {
    auth: null,
    projectName: '',
    description: '',
    projectNames: [],

    selectedDashboard: '',

    selectedProjectName: '',
    companyName: '',
    dashboardTab: 'main-tab',
    navAfterAuth: 'home',

    emailToEdit: { key: '', email: '' },
    error: null,
    loading: false,

    emaillist: [],
    googleServiceScopes: 'https://www.googleapis.com/auth/userinfo.email',
    githubServiceScopes: '',
    startScrapingClicked: false,
    runId: 0,
    completeTime: 0,
    selectedProjectTab: 'project-workflows',
    workflowEditor: { workflowName: '', workflowDescription: '', ownersRepos: [], selectedRepo: '', isPrivate: '', selectedBranch: '', workflowConfig: '', tokenFPR: '', loading: false, configLoading: false },
    workflowList: { workflowTab: 'private-workflows', workflows: [] },
    workspaceList: { workspaces: [], selectedWorkspaceTab: 'private-tab' },
    workspaceDashboard: { selectedTab: 'workflows-tab', selectedWfContainerTab: 'collection-tab', containers: [], selectedContainer: '', selectedWfContainerEditorTab: 'workflows-tab' },
    workspace: { workspaceSelected: '' },
    containerName: { name: '' },
    wfContainer: { selectedContainer: '' },
    workflowTree: { workflowPath: '' },
    workspaceEditor: { workspaceName: "", description: "", accessLevel: "" },
    workspaceUsers: { username: "", role: "" },
    clientError: '',
    taskRunner: { running: false },
    googleAuthConfig: { scopes: '',editable:true },
    varConfiguration: { ownersRepos: [], vars: [], varEditor: { repoName: '', varName: '', inputType: '', defaultValue: '', editVar: false } },
    workflowConfiguration: { workflowVars: {}, repoVars: {} }
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

      return { ...state, startScrapingClicked: false, completeTime: action.payload }
    case actionTypes.SET_GH_TKN:
      debugger
      return { ...state, auth: { ...state.auth, gh_tkn: action.payload.gh_tkn, gh_user: action.payload.gh_user } }
    case actionTypes.ID_TOKEN_UPDATED:
      return { ...state, auth: { ...state.auth, ...action.payload, timestamp: Date.now() + 3600000 } }
    case actionTypes.PROJECT_SELECTED:

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
      return { ...state, workflowEditor: { ...state.workflowEditor, repoBranches: action.payload, loading: false } }
    case actionTypes.REPO_SELECTED:

      return { ...state, workflowEditor: { ...state.workflowEditor, isPrivate: action.payload.isPrivate, selectedRepo: action.payload.selectedRepo, workflowName: `${state.auth.screenName}_${action.payload.selectedRepo}_${state.workflowEditor.selectedBranch}` } }
    case actionTypes.BRANCH_SELECTED:

      return { ...state, workflowEditor: { ...state.workflowEditor, selectedBranch: action.payload.branch, workflowName: `${state.auth.screenName}_${state.workflowEditor.selectedRepo}_${action.payload.branch}`, workflowConfig: action.payload.workflowConfig } }
    case actionTypes.TOKEN_FPR_CHANGED:
      return { ...state, workflowEditor: { ...state.workflowEditor, tokenFPR: action.payload } }
    case actionTypes.WORKFLOWS_FETCHED:
      return { ...state, workflowList: { workflows: action.payload } }
    case actionTypes.WORKFLOW_UPDATED:
      return { ...state, workflowEditor: { workflowName: '', workflowDescription: '', ownersRepos: [], selectedRepo: '', isPrivate: '', selectedBranch: '', workflowName: '', tokenFPR: '' } }
    case actionTypes.EDIT_WORKFLOW:
      return { ...state, workflowEditor: { ...state.workflowEditor, ...action.payload } }
    case actionTypes.WORKSPACE_EDITOR_INPUT_CHANGED:
      return { ...state, workspaceEditor: { ...state.workspaceEditor, ...action.payload } }
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

      return { ...state, workflowTree: { workflowPath: action.payload } }
    case actionTypes.TASK_SELECTED:
      return { ...state, workspaceTasks: { ...state.workspaceTasks, taskSelected: { ...action.payload } } }
    case actionTypes.GOOGLE_SCOPES:
      return { ...state, workspaceTasks: { ...state.workspaceTasks, googleScopes: action.payload } }
    case actionTypes.GOOGLE_AUTH_SUCCESS:
      return { ...state, auth: { ...state.auth, googleOauth: action.payload } }
    case actionTypes.WORKFLOW_SELECTED:
      return { ...state, taskWorkflows: { ...state.taskWorkflows, workflowSelected: { ...action.payload } } }

    case actionTypes.CREATE_NEW_WORKSPACE:
      return { ...state, workspaceEditor: { workspaceName: "", description: "", accessLevel: "" } }
    case actionTypes.WORKSPACE_TAB_CHANGED:

      return { ...state, workspaceList: { ...state.workspaceList, selectedWorkspaceTab: action.payload } }
    case actionTypes.WORKSPACE_USER_INPUT_CHANGED:
      return { ...state, workspaceUsers: { ...state.workspaceUsers, ...action.payload } }
    case actionTypes.WORKSPACES_COUNTED:
      return { ...state, workspaceList: { ...state.workspaceList, ...action.payload } }
    case actionTypes.WORKFLOW_CONFIG_FETCHED:
      return { ...state, workflowEditor: { ...state.workflowEditor, workflowConfig: action.payload, configLoading: false } }
    case actionTypes.WORKFLOW_CONFIG_PENDING:
      return { ...state, workflowEditor: { ...state.workflowEditor, configLoading: true } }
    case actionTypes.CLIENT_ERROR:
      return { ...state, clientError: action.payload }
    case actionTypes.CLEAR_ERROR_DISPLAY:
      return { ...state, clientError: '' }
    case actionTypes.CLOSE_WORKFLOW_EDITOR:
      return { ...state, workflowEditor: { workflowName: '', workflowDescription: '', ownersRepos: [], selectedRepo: '', isPrivate: '', selectedBranch: '', workflowConfig: '', tokenFPR: '', loading: false, configLoading: false } }
    case actionTypes.REPOS_BRANCHES_PENDING:
      return { ...state, workflowEditor: { ...state.workflowEditor, loading: true } }
    case actionTypes.RUNNER_STARTED:
      return { ...state, taskRunner: { ...state.taskRunner, [action.payload.workspace]: { runState: action.payload.runState, runid: action.payload.runid, start: action.payload.start }, running: true } }
    case actionTypes.RUNNER_COMPLETE:

      return { ...state, taskRunner: { ...state.taskRunner, running: false } }
    case actionTypes.RUNS_FETCHED:
      return { ...state, taskRunner: { ...state.taskRunner, runs: action.payload } }
    case actionTypes.NEXT_RUNS_FETCHED:
      return { ...state, taskRunner: { ...state.taskRunner, runs: [...state.taskRunner.runs, ...action.payload] } }
    case actionTypes.GOOGLE_AUTH_SCOPE_CHANGED:
      return { ...state, googleAuthConfig: { ...state.googleAuthConfig, scopes: action.payload } }
    case actionTypes.GOOGLE_OAUTH_SCOPE_SAVED:
      return { ...state, googleAuthConfig: { ...state.googleAuthConfig, editable:false } }
    case actionTypes.EDIT_GOOGLE_OAUTH_SCOPE:
      return { ...state, googleAuthConfig: { ...state.googleAuthConfig, editable:true } }
    case actionTypes.VAR_REPO_SELECTED:
      return { ...state, varConfiguration: { ...state.varConfiguration, varEditor: { ...state.varConfiguration.varEditor, repoName: action.payload } } }
    case actionTypes.VAR_REPOS_FETCHED:
      return { ...state, varConfiguration: { ...state.varConfiguration, ownersRepos: action.payload } }
    case actionTypes.VAR_NAME_CHANGED:
      return { ...state, varConfiguration: { ...state.varConfiguration, varEditor: { ...state.varConfiguration.varEditor, varName: action.payload } } }
    case actionTypes.VAR_TYPE_CHANGED:
      return { ...state, varConfiguration: { ...state.varConfiguration, varEditor: { ...state.varConfiguration.varEditor, inputType: action.payload } } }
    case actionTypes.VAR_DEFAULT_CHANGED:
      return { ...state, varConfiguration: { ...state.varConfiguration, varEditor: { ...state.varConfiguration.varEditor, defaultValue: action.payload } } }
    case actionTypes.VAR_ADDED:
      return {
        ...state, varConfiguration: {
          ...state.varConfiguration, varEditor: { varName: '', inputType: '', defaultValue: '', editVar: false, repoName: '' }, vars: state.varConfiguration.vars.map(v => {
            const repoName = v[0]
            if (repoName === action.payload.repoName) {
              const repoVars = v[1]['vars']
              const mappedObj = { ...repoVars, [action.payload.varKey]: { defaultValue: action.payload.defaultValue, inputType: action.payload.inputType, varName: action.payload.varName } }

              const mappedArray = [repoName, { vars: mappedObj }]
              debugger;
              return mappedArray

            } else {
              return v
            }
          })
        }
      }
    case actionTypes.VARS_FETCHED:
      return { ...state, varConfiguration: { ...state.varConfiguration, vars: action.payload } }
    case actionTypes.EDIT_VAR_CLICKED:
      debugger;
      return { ...state, varConfiguration: { ...state.varConfiguration, varEditor: { ...action.payload, editVar: true } } }
    case actionTypes.VAR_UPDATED:

      return {
        ...state, varConfiguration: {
          ...state.varConfiguration, varEditor: { varName: '', inputType: '', defaultValue: '', editVar: false, repoName: '' }, vars: state.varConfiguration.vars.map(v => {
            const repoName = v[0]
            if (repoName === action.payload.repoName) {
              const repoVars = v[1]['vars']
              let mappedObj = {}
              for (let r in repoVars) {

                if (r === action.payload.varKey) {
                  debugger;
                  mappedObj = { ...repoVars, [action.payload.varKey]: { defaultValue: action.payload.defaultValue, inputType: action.payload.inputType, varName: action.payload.varName } }
                  break;
                } else {
                  mappedObj = { ...repoVars }
                }
              }
              debugger;


              const mappedArray = [repoName, { vars: mappedObj }]
              debugger;
              return mappedArray

            } else {
              return v
            }
          })
        }
      }
    case actionTypes.VAR_REMOVED:


      return {
        ...state, varConfiguration: {
          ...state.varConfiguration, varEditor: { varName: '', inputType: '', defaultValue: '', editVar: false, repoName: '' }, vars: state.varConfiguration.vars.map(v => {
            const repoName = v[0]
            if (repoName === action.payload.repoName) {
              const repoVars = v[1]['vars']

              let mappedObj = {}
              for (let r in repoVars) {

                if (r === action.payload.varKey) {
                  debugger;
                  delete repoVars[action.payload.varKey]
                  mappedObj = repoVars
                  debugger;
                  break;
                } else {
                  mappedObj = { ...repoVars }
                }
              }
              debugger;


              const mappedArray = [repoName, { vars: mappedObj }]
              debugger;


              return mappedArray

            } else {
              return v
            }
          })
        }
      }
    case actionTypes.WORKFLOW_INPUT_CHANGED:
      let updatedWorkflowVars = state.workflowConfiguration.workflowVars
      for (let uwf in updatedWorkflowVars) {
        if (uwf === action.payload.key) {
          updatedWorkflowVars[uwf].value = action.payload.value
   
          break;
        }
      }
      return {
        ...state, workflowConfiguration: {
          ...state.workflowConfiguration, workflowVars: {
            ...state.workflowConfiguration.workflowVars, ...updatedWorkflowVars
          }
        }
      }
    case actionTypes.REPO_VARS_FETCHED:
      return { ...state, workflowConfiguration: { ...state.workflowConfiguration, repoVars: action.payload } }
    case actionTypes.WORKFLOW_VARS_FETCHED:
      return { ...state, workflowConfiguration: { ...state.workflowConfiguration, workflowVars: action.payload } }
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
  REPOS_BRANCHES_PENDING: 'REPOS_BRANCHES_PENDING',
  REPO_SELECTED: 'REPO_SELECTED',
  BRANCH_SELECTED: 'BRANCH_SELECTED',
  TOKEN_FPR_CHANGED: 'TOKEN_FPR_CHANGED',
  WORKFLOWS_FETCHED: 'WORKFLOWS_FETCHED',
  WORKFLOW_UPDATED: 'WORKFLOW_UPDATED',
  EDIT_WORKFLOW: 'EDIT_WORKFLOW',

  WORKSPACE_EDITOR_INPUT_CHANGED: 'WORKSPACE_EDITOR_INPUT_CHANGED',
  CREATE_NEW_WORKSPACE: 'CREATE_NEW_WORKSPACE',

  WORKSPACES_FETCHED: 'WORKSPACES_FETCHED',
  WORKSPACE_SELECTED: 'WORKSPACE_SELECTED',

  CONTAINER_NAME_CHANGED: 'CONTAINER_NAME_CHANGED',
  CONTAINERS_FETCHED: 'CONTAINERS_FETCHED',
  WF_CONTAINER_SELECTED: 'WF_CONTAINER_SELECTED',
  WF_CONTAINER_EDITOR_TAB_CHANGED: 'WF_CONTAINER_EDITOR_TAB_CHANGED',
  CONTAINER_NAME_SAVED: 'CONTAINER_NAME_SAVED',
  WORKFLOW_PATH_CHANGED: 'WORKFLOW_PATH_CHANGED',
  TASK_SELECTED: 'TASK_SELECTED',
  GOOGLE_SCOPES: 'GOOGLE_SCOPES',
  GOOGLE_AUTH_SUCCESS: 'GOOGLE_AUTH_SUCCESS',
  WORKFLOW_SELECTED: 'WORKFLOW_SELECTED',
  WORKSPACE_TAB_CHANGED: 'WORKSPACE_TAB_CHANGED',
  WORKSPACE_USER_INPUT_CHANGED: 'WORKSPACE_USER_INPUT_CHANGED',
  WORKSPACES_COUNTED: 'WORKSPACES_COUNTED',
  WORKFLOW_CONFIG_FETCHED: 'WORKFLOW_CONFIG_FETCHED',
  WORKFLOW_CONFIG_PENDING: 'WORKFLOW_CONFIG_PENDING',
  CLIENT_ERROR: 'CLIENT_ERROR',
  CLEAR_ERROR_DISPLAY: 'CLEAR_ERROR_DISPLAY',

  CLOSE_WORKFLOW_EDITOR: 'CLOSE_WORKFLOW_EDITOR',
  RUNNER_STARTED: "RUNNER_STARTED",
  RUNNER_COMPLETE: "RUNNER_COMPLETE",
  RUNS_FETCHED: "RUNS_FETCHED",
  NEXT_RUNS_FETCHED: "NEXT_RUNS_FETCHED",
  GOOGLE_AUTH_SCOPE_CHANGED: "GOOGLE_AUTH_SCOPE_CHANGED",
  GOOGLE_OAUTH_SCOPE_SAVED:'GOOGLE_OAUTH_SCOPE_SAVED',

  VAR_REPO_SELECTED: 'VAR_REPO_SELECTED',
  VAR_REPOS_FETCHED: 'VAR_REPOS_FETCHED',
  VAR_NAME_CHANGED: 'VAR_NAME_CHANGED',
  VAR_TYPE_CHANGED: 'VAR_TYPE_CHANGED',
  VAR_DEFAULT_CHANGED: 'VAR_DEFAULT_CHANGED',
  VAR_ADDED: 'VAR_ADDED',
  VARS_FETCHED: 'VARS_FETCHED',
  EDIT_VAR_CLICKED: 'EDIT_VAR_CLICKED',
  VAR_UPDATED: 'VAR_UPDATED',
  VAR_REMOVED: 'VAR_REMOVED',
  WORKFLOW_INPUT_CHANGED: 'WORKFLOW_INPUT_CHANGED',
  REPO_VARS_FETCHED: 'REPO_VARS_FETCHED',
  WORKFLOW_VARS_FETCHED: 'WORKFLOW_VARS_FETCHED',
  EDIT_GOOGLE_OAUTH_SCOPE:'EDIT_GOOGLE_OAUTH_SCOPE'

};
